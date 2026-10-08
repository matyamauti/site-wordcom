export const CHAVE_COOKIES = "wordcom:consentimento:v1";
export const VALIDADE_COOKIES = 180 * 24 * 60 * 60 * 1000;
export type PreferenciasCookies = {
  versao: 1;
  analise: boolean;
  publicidade: boolean;
  atualizadoEm: number;
};

export function interpretarPreferencias(valor: string | null | undefined, agora = Date.now()): PreferenciasCookies | null {
  if (!valor) return null;
  try {
    const dados = JSON.parse(valor);
    if (!dados || dados.versao !== 1 || typeof dados.analise !== "boolean" ||
      typeof dados.publicidade !== "boolean" || !Number.isFinite(dados.atualizadoEm) ||
      dados.atualizadoEm > agora || agora - dados.atualizadoEm >= VALIDADE_COOKIES) return null;
    return dados;
  } catch {
    return null;
  }
}

let memoria: string | null = null;
let falhaAoGravar = false;

export function lerPreferenciasCookies() {
  if (typeof window === "undefined") return null;
  try {
    return falhaAoGravar ? memoria : window.localStorage.getItem(CHAVE_COOKIES);
  } catch {
    return memoria;
  }
}

export function salvarPreferenciasCookies(analise: boolean, publicidade: boolean) {
  const preferencias: PreferenciasCookies = { versao: 1, analise, publicidade, atualizadoEm: Date.now() };
  memoria = JSON.stringify(preferencias);
  try {
    window.localStorage.setItem(CHAVE_COOKIES, memoria);
    falhaAoGravar = false;
  } catch {
    falhaAoGravar = true;
    // Sem armazenamento disponivel, a escolha vale apenas nesta sessao da pagina.
  }
  window.dispatchEvent(new Event("wordcom:consentimento"));
}

export function assinarPreferenciasCookies(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("wordcom:consentimento", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wordcom:consentimento", callback);
  };
}

export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event("wordcom:abrir-cookies"));
}

export function permiteEventoDeConversao() {
  const preferencias = interpretarPreferencias(lerPreferenciasCookies());
  return preferencias?.analise === true && preferencias.publicidade === true;
}
