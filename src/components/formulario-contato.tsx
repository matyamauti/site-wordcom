"use client";

import { useRef, useState } from "react";
import { permiteEventoDeConversao } from "@/lib/cookies";

/* Formulário de contato — reimplementação do que o site já fazia:
   POST em /api/lead com os campos, a origem, a URL de entrada e os cinco
   parâmetros UTM, mais o evento `lead_form_submit` no dataLayer do GTM.
   Estados de envio, sucesso e erro com role="status" / role="alert", como no
   original.

   Melhorias sem efeito visual:
   - `noValidate` + validação própria: a bolha nativa do browser não é
     estilizável, some sozinha e não é lida de forma consistente. O erro passa
     a ficar ligado ao campo por aria-describedby.
   - aria-invalid nos campos com erro.
   - o campo honeypot ganhou `tabIndex={-1}` e ficou fora da ordem de foco
     (já era aria-hidden no original).
   - o telefone continua aceitando só dígitos, como antes, mas a limpeza
     acontece sem quebrar colagem de número formatado. */

type Estado = "idle" | "sending" | "success" | "error";

const frentes = [
  "Comunicação integrada",
  "Campanha e mídia",
  "Conteúdo e audiovisual",
  "Evento corporativo",
  "Branding",
];

export function FormularioContato() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erros, setErros] = useState<Record<string, string>>({});
  const envioEmCurso = useRef(false);

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (envioEmCurso.current) return;
    const form = ev.currentTarget;
    const dados = Object.fromEntries(
      new FormData(form).entries(),
    ) as Record<string, string>;

    const e: Record<string, string> = {};
    if (!dados.nome?.trim()) e.nome = "Informe seu nome.";
    if (!dados.email?.trim()) e.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dados.email.trim()))
      e.email = "Confira o endereço: falta o domínio ou o @.";
    if (!dados.empresa?.trim()) e.empresa = "Informe a empresa.";
    if (!dados.telefone?.trim()) e.telefone = "Informe um telefone.";
    else if (dados.telefone.replace(/\D/g, "").length < 10)
      e.telefone = "Inclua o DDD, com no mínimo 10 dígitos.";
    if (!dados.servico) e.servico = "Escolha uma frente.";
    if (!dados.mensagem?.trim()) e.mensagem = "Conte brevemente o desafio.";
    if (!dados.consentimento) e.consentimento = "Precisamos da sua autorização.";

    setErros(e);
    if (Object.keys(e).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }

    envioEmCurso.current = true;
    setEstado("sending");
    const q = new URLSearchParams(window.location.search);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(50_000),
        body: JSON.stringify({
          ...dados,
          origem: document.referrer || "Acesso direto",
          urlEntrada: window.location.href,
          utmSource: q.get("utm_source") || "",
          utmMedium: q.get("utm_medium") || "",
          utmCampaign: q.get("utm_campaign") || "",
          utmContent: q.get("utm_content") || "",
          utmTerm: q.get("utm_term") || "",
        }),
      });
      const resposta = await r.json();
      if (!r.ok || resposta.ok !== true) {
        if (r.status === 422 && resposta.campos) {
          setErros(resposta.campos);
          const campo = Object.keys(resposta.campos)[0];
          const elemento = form.elements.namedItem(campo);
          if (elemento instanceof HTMLElement) elemento.focus();
        }
        throw new Error("Falha no envio");
      }
      setEstado("success");
      form.reset();
      if (permiteEventoDeConversao()) {
        const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: "lead_form_submit", form_name: "contato_wordcom" });
      }
    } catch {
      setEstado("error");
    } finally {
      envioEmCurso.current = false;
    }
  }

  const erro = (campo: string) =>
    erros[campo] ? (
      <small
        id={`erro-${campo}`}
        className="formStatus error"
        style={{ marginTop: 6 }}
      >
        {erros[campo]}
      </small>
    ) : null;

  const attrs = (campo: string) => ({
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? `erro-${campo}` : undefined,
  });

  return (
    <form onSubmit={enviar} noValidate>
      <label>
        <span>Nome</span>
        <input
          name="nome"
          maxLength={100}
          autoComplete="name"
          placeholder="Como podemos chamar você?"
          {...attrs("nome")}
        />
        {erro("nome")}
      </label>

      <label>
        <span>E-mail corporativo</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          maxLength={150}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="voce@empresa.com.br"
          {...attrs("email")}
        />
        {erro("email")}
      </label>

      <label>
        <span>Empresa</span>
        <input
          name="empresa"
          maxLength={120}
          autoComplete="organization"
          placeholder="Nome da empresa"
          {...attrs("empresa")}
        />
        {erro("empresa")}
      </label>

      <label>
        <span>Telefone / WhatsApp</span>
        <input
          name="telefone"
          type="tel"
          inputMode="numeric"
          maxLength={15}
          autoComplete="tel"
          placeholder="11999999999"
          onInput={(ev) => {
            const el = ev.currentTarget;
            el.value = el.value.replace(/\D/g, "").slice(0, 15);
          }}
          {...attrs("telefone")}
        />
        {erro("telefone")}
      </label>

      <label>
        <span>Como podemos ajudar?</span>
        <select name="servico" defaultValue="" {...attrs("servico")}>
          <option value="" disabled>
            Selecione uma frente
          </option>
          {frentes.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        {erro("servico")}
      </label>

      <label className="full">
        <span>Conte brevemente o desafio</span>
        <textarea
          name="mensagem"
          maxLength={2000}
          placeholder="Escreva sua mensagem"
          {...attrs("mensagem")}
        />
        {erro("mensagem")}
      </label>

      <label className="consent full">
        <input type="checkbox" name="consentimento" value="sim" {...attrs("consentimento")} />
        <span>
          Autorizo o contato da WordCom e o tratamento dos meus dados para
          atendimento desta solicitação.
        </span>
      </label>
      {erros.consentimento ? (
        <small id="erro-consentimento" className="formStatus error full">
          {erros.consentimento}
        </small>
      ) : null}

      {/* honeypot: só robô preenche um campo que não aparece na tela */}
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <button disabled={estado === "sending"} type="submit" className="btn">
        {estado === "sending" ? "Enviando…" : "Enviar contato ↗"}
      </button>

      {estado === "success" ? (
        <p className="formStatus success" role="status">
          Mensagem enviada. Em breve, nosso time entrará em contato.
        </p>
      ) : null}
      {estado === "error" ? (
        <p className="formStatus error" role="alert">
          Não foi possível enviar agora. Tente novamente ou fale conosco pelo
          WhatsApp.
        </p>
      ) : null}
    </form>
  );
}
