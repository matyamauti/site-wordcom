import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { DESTINATARIO_CONTATO, LOGO_CONTATO_CID, montarEmailContato, validarContato } from "@/lib/contato-email";

export const runtime = "nodejs";
export const maxDuration = 45;

const MAX_BYTES = 16_384;
const JANELA = 10 * 60 * 1000;
// Freio de rajadas por instancia; nao substitui o firewall distribuido da Vercel.
const tentativas = new Map<string, { quantidade: number; expira: number }>();

function permitirEnvio(email: string) {
  const agora = Date.now();
  for (const [chave, registro] of tentativas) {
    if (registro.expira <= agora) tentativas.delete(chave);
  }
  const chave = createHash("sha256").update(email.toLowerCase()).digest("hex");
  const registro = tentativas.get(chave);
  if (registro && registro.quantidade >= 3) return false;
  if (!registro && tentativas.size >= 1000) return false;
  tentativas.set(chave, {
    quantidade: (registro?.quantidade ?? 0) + 1,
    expira: registro?.expira ?? agora + JANELA,
  });
  return true;
}

export async function POST(req: Request) {
  // O envio publico depende de ativacao explicita apos o teste de recebimento.
  if (process.env.VERCEL && process.env.CONTACT_EMAIL_ENABLED !== "true") {
    return NextResponse.json(
      { erro: "O envio pelo formulário está temporariamente indisponível. Fale conosco pelo WhatsApp." },
      { status: 503 },
    );
  }
  const origem = req.headers.get("origin");
  if (origem && origem !== new URL(req.url).origin) {
    return NextResponse.json({ erro: "Origem da solicitação não permitida." }, { status: 403 });
  }
  if (req.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return NextResponse.json({ erro: "Envie os dados em JSON." }, { status: 415 });
  }

  let dados: Record<string, unknown>;
  try {
    const leitor = req.body?.getReader();
    if (!leitor) throw new Error("Corpo ausente");
    let tamanho = 0;
    const partes: Uint8Array[] = [];
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > MAX_BYTES) {
        await leitor.cancel();
        return NextResponse.json({ erro: "A mensagem excede o limite permitido." }, { status: 413 });
      }
      partes.push(value);
    }
    const json: unknown = JSON.parse(Buffer.concat(partes).toString("utf8"));
    if (!json || typeof json !== "object" || Array.isArray(json)) throw new Error("Formato inválido");
    dados = json as Record<string, unknown>;
  } catch {
    return NextResponse.json({ erro: "Dados da solicitação inválidos." }, { status: 400 });
  }

  if (typeof dados.website === "string" && dados.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }
  const resultado = validarContato(dados);
  if (!resultado.ok) {
    return NextResponse.json({ erro: "Confira os campos do formulário.", campos: resultado.campos }, { status: 422 });
  }

  const user = process.env.GOOGLE_SMTP_USER?.trim();
  const pass = process.env.GOOGLE_SMTP_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !/^[^\s<>(),;:"\\@]+@wordcom\.com\.br$/i.test(user) || !pass) {
    return NextResponse.json({ erro: "O envio de e-mail ainda não está configurado." }, { status: 503 });
  }
  const { contato } = resultado;
  if (!permitirEnvio(contato.email)) {
    return NextResponse.json(
      { erro: "Limite de tentativas atingido. Aguarde alguns minutos ou fale pelo WhatsApp." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  const transporte = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass },
    connectionTimeout: 8000, greetingTimeout: 8000, dnsTimeout: 8000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
  });
  try {
    const logo = await readFile(path.join(process.cwd(), "public", "marca", "wordcom-logo.png"));
    const envio = await transporte.sendMail({
      from: { name: "WordCom | Contato do site", address: user },
      to: DESTINATARIO_CONTATO,
      replyTo: { name: contato.nome, address: contato.email },
      ...montarEmailContato(contato),
      attachments: [{
        filename: "wordcom-logo.png", content: logo, contentType: "image/png",
        cid: LOGO_CONTATO_CID, contentDisposition: "inline",
      }],
    });
    if (!envio.accepted.some((endereco) =>
      endereco.toLowerCase() === DESTINATARIO_CONTATO,
    )) throw new Error("Destinatário não aceito");
    return NextResponse.json({ ok: true });
  } catch {
    // Nao registrar credenciais, respostas SMTP ou dados pessoais nos logs.
    console.error("[contato] O servidor de e-mail não confirmou o envio.");
    return NextResponse.json({ erro: "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp." }, { status: 502 });
  } finally {
    transporte.close();
  }
}
