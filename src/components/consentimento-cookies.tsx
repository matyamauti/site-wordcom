"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import {
  abrirPreferenciasCookies, assinarPreferenciasCookies, interpretarPreferencias,
  lerPreferenciasCookies, salvarPreferenciasCookies,
} from "@/lib/cookies";
import styles from "./consentimento-cookies.module.css";

export function BotaoPreferenciasCookies() {
  return <button type="button" className={styles.footerButton} onClick={abrirPreferenciasCookies}>
    <Settings2 size={18} aria-hidden="true" />Preferências de cookies
  </button>;
}

export function ConsentimentoCookies() {
  const valor = useSyncExternalStore(assinarPreferenciasCookies, lerPreferenciasCookies, () => undefined);
  const preferencias = interpretarPreferencias(valor);
  const mostrarAviso = valor !== undefined && !preferencias;
  const dialogo = useRef<HTMLDialogElement>(null);
  const faixa = useRef<HTMLElement>(null);
  const origemFoco = useRef<HTMLElement | null>(null);
  const tituloDialogo = useRef<HTMLHeadingElement>(null);
  const [analise, setAnalise] = useState(false);
  const [publicidade, setPublicidade] = useState(false);

  useEffect(() => {
    function abrir() {
      const atual = interpretarPreferencias(lerPreferenciasCookies());
      setAnalise(atual?.analise ?? false);
      setPublicidade(atual?.publicidade ?? false);
      origemFoco.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialogo.current?.showModal();
      tituloDialogo.current?.focus();
    }
    window.addEventListener("wordcom:abrir-cookies", abrir);
    return () => window.removeEventListener("wordcom:abrir-cookies", abrir);
  }, []);

  useEffect(() => {
    const atualizar = () => document.documentElement.style.setProperty(
      "--altura-aviso-cookies", `${faixa.current?.getBoundingClientRect().height ?? 0}px`,
    );
    atualizar();
    const observer = new ResizeObserver(atualizar);
    if (faixa.current) observer.observe(faixa.current);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--altura-aviso-cookies");
    };
  }, [mostrarAviso]);

  function fechar() {
    dialogo.current?.close();
    if (origemFoco.current?.isConnected) origemFoco.current.focus();
  }

  function salvar(permitirAnalise: boolean, permitirPublicidade: boolean) {
    salvarPreferenciasCookies(permitirAnalise, permitirPublicidade);
    fechar();
  }

  return <>
    {mostrarAviso && <section ref={faixa} className={styles.banner} aria-labelledby="cookies-titulo">
      <div className={styles.bannerText}>
        <h2 id="cookies-titulo"><Cookie size={22} aria-hidden="true" />Sua privacidade importa</h2>
        <p>Você escolhe se permite cookies de análise e publicidade. Os recursos opcionais estão desativados nesta versão. <Link href="/politica-de-cookies">Saiba mais</Link></p>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => salvar(false, false)}>Rejeitar opcionais</button>
        <button type="button" onClick={abrirPreferenciasCookies}>Personalizar</button>
        <button type="button" onClick={() => salvar(true, true)}>Aceitar todos</button>
      </div>
    </section>}
    <dialog ref={dialogo} className={styles.dialog} aria-labelledby="cookies-preferencias-titulo" aria-describedby="cookies-descricao" onCancel={(e) => { e.preventDefault(); fechar(); }}>
      <div className={styles.dialogHeader}>
        <h2 id="cookies-preferencias-titulo" ref={tituloDialogo} tabIndex={-1}>Preferências de cookies</h2>
        <button type="button" className={styles.close} aria-label="Fechar preferências" title="Fechar preferências" onClick={fechar}><X size={22} aria-hidden="true" /></button>
      </div>
      <p id="cookies-descricao">Escolha quais recursos opcionais você permite. É possível mudar sua decisão a qualquer momento pelo rodapé.</p>
      <div className={styles.category}>
        <div><h3>Necessários</h3><p>Guardam sua escolha de privacidade neste navegador por até 180 dias.</p></div>
        <span className={styles.required}>Sempre ativos</span>
      </div>
      <label className={styles.category}>
        <div><h3>Análise</h3><p>Permitem medir visitas e navegação, com ferramentas como o Google Analytics.</p></div>
        <input type="checkbox" checked={analise} onChange={(e) => setAnalise(e.target.checked)} aria-label="Permitir cookies de análise" />
      </label>
      <label className={styles.category}>
        <div><h3>Publicidade</h3><p>Permitem medir campanhas e ações relacionadas a anúncios, com ferramentas como o Meta Pixel.</p></div>
        <input type="checkbox" checked={publicidade} onChange={(e) => setPublicidade(e.target.checked)} aria-label="Permitir cookies de publicidade" />
      </label>
      <p className={styles.note}>Analytics, Meta Pixel e GTM ainda não estão ativados neste novo site. Salvar sua preferência não instala essas ferramentas. <Link href="/politica-de-cookies" onClick={fechar}>Política de cookies</Link></p>
      <div className={styles.dialogActions}>
        <button type="button" onClick={() => salvar(false, false)}>Rejeitar opcionais</button>
        <button type="button" onClick={() => salvar(true, true)}>Aceitar todos</button>
        <button type="button" className={styles.save} onClick={() => salvar(analise, publicidade)}>Salvar preferências</button>
      </div>
    </dialog>
  </>;
}
