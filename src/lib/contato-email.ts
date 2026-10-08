export const DESTINATARIO_CONTATO = "comercial@wordcom.com.br";
export const LOGO_CONTATO_CID = "wordcom-logo@wordcom.com.br";

const LIMITES = { nome: 100, email: 150, empresa: 120, telefone: 15, servico: 100, mensagem: 2000 } as const;
const FRENTES = ["Comunicação integrada", "Campanha e mídia", "Conteúdo e audiovisual", "Evento corporativo", "Branding"];
const METADADOS = [
  ["origem", "Origem"], ["urlEntrada", "Página de entrada"],
  ["utmSource", "UTM source"], ["utmMedium", "UTM medium"],
  ["utmCampaign", "UTM campaign"], ["utmContent", "UTM content"], ["utmTerm", "UTM term"],
] as const;

export type Contato = Record<keyof typeof LIMITES, string> & {
  consentimento: true;
  metadados: [string, string][];
};

type Validacao = { ok: true; contato: Contato } | { ok: false; campos: Record<string, string> };

export function validarContato(dados: Record<string, unknown>): Validacao {
  const campos: Record<string, string> = {};
  const valores = {} as Record<keyof typeof LIMITES, string>;
  for (const chave of Object.keys(LIMITES) as (keyof typeof LIMITES)[]) {
    const valor = dados[chave];
    if (typeof valor !== "string" || !valor.trim() || valor.length > LIMITES[chave]) {
      campos[chave] = `Preencha este campo com até ${LIMITES[chave]} caracteres.`;
      continue;
    }
    // Campos usados nos cabecalhos nao aceitam controles ou quebras de linha.
    const controle = chave === "mensagem"
      ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u
      : /[\u0000-\u001f\u007f]/u;
    if (controle.test(valor)) campos[chave] = "Remova os caracteres inválidos deste campo.";
    valores[chave] = valor.trim();
  }
  if (valores.email && !/^[^\s<>(),;:"\\@]+@[^\s<>(),;:"\\@]+\.[^\s<>(),;:"\\@]{2,}$/u.test(valores.email)) {
    campos.email = "Confira o endereço de e-mail informado.";
  }
  if (valores.telefone && !/^\d{10,15}$/.test(valores.telefone)) campos.telefone = "Informe de 10 a 15 dígitos, incluindo o DDD.";
  if (valores.servico && !FRENTES.includes(valores.servico)) campos.servico = "Escolha uma das frentes disponíveis.";
  if (dados.consentimento !== "sim" && dados.consentimento !== true) campos.consentimento = "Precisamos da sua autorização para entrar em contato.";
  if (Object.keys(campos).length) return { ok: false, campos };

  const metadados: [string, string][] = [];
  for (const [chave, rotulo] of METADADOS) {
    const valor = dados[chave];
    if (typeof valor === "string" && valor.trim()) metadados.push([rotulo, valor.trim().slice(0, 1000)]);
  }
  return { ok: true, contato: { ...valores, consentimento: true, metadados } };
}

function escaparHtml(texto: string) {
  return texto.replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[caractere]!);
}

export function montarEmailContato(contato: Contato, recebidoEm = new Date()) {
  const data = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo",
  }).format(recebidoEm);
  const linhas: [string, string][] = [
    ["Nome", contato.nome], ["E-mail", contato.email], ["Empresa", contato.empresa],
    ["Telefone / WhatsApp", contato.telefone], ["Como podemos ajudar", contato.servico],
    ["Recebido em", `${data} (horário de Brasília)`],
  ];
  const consentimento = "O visitante autorizou o contato e o tratamento dos dados para atendimento desta solicitação.";
  const tabela = (itens: [string, string][]) => itens.map(([rotulo, valor]) => `
    <tr><td style="padding:16px 0;border-bottom:1px solid #e5e7eb;vertical-align:top;">
      <div style="font-size:13px;line-height:1.5;color:#55505c;margin-bottom:4px;">${escaparHtml(rotulo)}</div>
      <div style="font-size:16px;line-height:1.6;color:#15101c;overflow-wrap:anywhere;">${escaparHtml(valor)}</div>
    </td></tr>`).join("");

  return {
    subject: `[Site WordCom] Novo contato - ${contato.empresa}`,
    text: [
      "Novo contato pelo site WordCom", "", ...linhas.map(([rotulo, valor]) => `${rotulo}: ${valor}`),
      "", "Mensagem:", contato.mensagem, "", "Consentimento:", consentimento,
      ...(contato.metadados.length ? ["", "Origem do contato (informada pelo navegador):",
        ...contato.metadados.map(([rotulo, valor]) => `${rotulo}: ${valor}`)] : []),
      "", "Use Responder para falar diretamente com o visitante.",
    ].join("\n"),
    html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Novo contato | WordCom</title></head>
      <body style="margin:0;padding:24px 12px;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;table-layout:fixed;margin:0 auto;border-collapse:collapse;background-color:#ffffff;">
          <tr><td bgcolor="#15101c" style="padding:32px 24px;background-color:#15101c;border-top:4px solid #ff7d00;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center">
              <img src="cid:${LOGO_CONTATO_CID}" alt="WordCom Publicidade" width="180" height="75" style="display:block;width:180px;max-width:100%;height:auto;margin:0 auto;border:0;color:#ffffff;font-size:18px;">
            </td></tr></table>
            <h1 style="margin:28px 0 10px;color:#ffffff;font-size:26px;line-height:1.3;font-weight:700;">Novo contato pelo site</h1>
            <p style="margin:0;color:#d8d2df;font-size:15px;line-height:1.6;">Uma nova solicitação para a equipe comercial da WordCom</p>
          </td></tr>
          <tr><td style="padding:28px 24px;">
            <h2 style="margin:0 0 4px;font-size:20px;line-height:1.4;color:#15101c;">Dados do contato</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">${tabela(linhas)}</table>
          </td></tr>
          <tr><td bgcolor="#f5f3f7" style="padding:28px 24px;background-color:#f5f3f7;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
            <h2 style="margin:0 0 14px;font-size:20px;line-height:1.4;color:#15101c;">Mensagem do visitante</h2>
            <p style="margin:0;font-size:16px;line-height:1.8;color:#15101c;overflow-wrap:anywhere;word-wrap:break-word;">${escaparHtml(contato.mensagem).replace(/\r?\n/g, "<br>")}</p>
          </td></tr>
          <tr><td style="padding:28px 24px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#55505c;">Use o botão abaixo ou a opção <strong>Responder</strong> do seu e-mail para falar diretamente com o visitante.</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#ff7d00" style="background-color:#ff7d00;border:1px solid #ff7d00;">
              <a href="mailto:${encodeURIComponent(contato.email)}" style="display:inline-block;padding:14px 20px;color:#15101c;font-size:15px;line-height:1.4;font-weight:700;text-decoration:none;">Responder ao contato</a>
            </td></tr></table>
            <h2 style="margin:28px 0 8px;font-size:16px;line-height:1.4;color:#15101c;">Consentimento</h2>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#55505c;">${consentimento}</p>
            ${contato.metadados.length ? `<h2 style="margin:28px 0 8px;font-size:16px;color:#15101c;">Origem do contato</h2>
              <p style="margin:0;font-size:12px;line-height:1.6;color:#55505c;">Informações enviadas pelo navegador do visitante.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">${tabela(contato.metadados)}</table>` : ""}
          </td></tr>
          <tr><td bgcolor="#15101c" style="padding:24px;background-color:#15101c;">
            <p style="margin:0 0 6px;color:#ffffff;font-size:14px;font-weight:700;line-height:1.5;">WordCom Publicidade</p>
            <p style="margin:0;color:#d8d2df;font-size:12px;line-height:1.6;">A última palavra em comunicação</p>
            <p style="margin:14px 0 0;color:#d8d2df;font-size:12px;line-height:1.6;">Mensagem automática do formulário de contato. Dados destinados ao atendimento desta solicitação.</p>
          </td></tr>
        </table>
      </body></html>`,
  };
}
