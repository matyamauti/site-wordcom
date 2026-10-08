"use client";

import { useEffect, useRef, useState } from "react";

/* Menu de celular.

   Medido antes de existir: abaixo de 980px os quatro links da navegação ficavam
   em `display: none` e NÃO havia botão nenhum no lugar. Quem abria o site pelo
   telefone via só a logo — não dava para ir a Soluções, Cases ou Projetos sem
   rolar a página inteira.

   É um painel de revelação, não um modal: não prende o foco nem bloqueia a
   página, porque não há tarefa a proteger aqui. O que ele tem, porque navegação
   precisa ter:
   - botão de verdade, com aria-expanded e aria-controls
   - Escape fecha e devolve o foco ao botão
   - clique fora fecha
   - fecha ao navegar, senão o painel cobriria a seção recém-aberta
   - rolagem da página travada enquanto aberto, para o toque não arrastar a
     página por baixo do painel */

type Item = { href: string; texto: string };

export function MenuMobile({
  itens,
  whatsapp,
}: {
  itens: Item[];
  whatsapp: string;
}) {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return undefined;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAberto(false);
      botaoRef.current?.focus();
    };
    const aoApontar = (e: PointerEvent) => {
      const alvo = e.target as Node;
      if (painelRef.current?.contains(alvo) || botaoRef.current?.contains(alvo)) {
        return;
      }
      setAberto(false);
    };

    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("pointerdown", aoApontar);

    /* trava a rolagem sem perder a posição: sem isto o dedo arrasta a página
       por baixo do painel */
    const y = window.scrollY;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("pointerdown", aoApontar);
      document.body.style.overflow = anterior;
      window.scrollTo(0, y);
    };
  }, [aberto]);

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        className="menuBotao"
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => setAberto((v) => !v)}
      >
        <span className="menuBarras" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="soLeitor">{aberto ? "Fechar menu" : "Abrir menu"}</span>
      </button>

      <div
        id="menu-mobile"
        ref={painelRef}
        className={`menuPainel${aberto ? " aberto" : ""}`}
        hidden={!aberto}
      >
        <nav aria-label="Navegação principal, versão compacta">
          {itens.map((i) => (
            <a key={i.href} href={i.href} onClick={() => setAberto(false)}>
              {i.texto}
            </a>
          ))}
        </nav>
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="btn menuWhats"
          onClick={() => setAberto(false)}
        >
          Falar no WhatsApp
        </a>
      </div>
    </>
  );
}
