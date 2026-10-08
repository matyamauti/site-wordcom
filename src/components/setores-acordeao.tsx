"use client";

import { useId, useRef, useState } from "react";

/* Experiência setorial — WordCom.

   Os seis setores viram um acordeão de duas colunas: fechado mostra ícone e
   nome, aberto revela o que a WordCom faz naquele mercado. Um aberto por vez.

   A expansão NÃO usa max-height. Animar max-height obriga a chutar um valor
   maior que o conteúdo real, o que deixa a abertura rápida demais e o
   fechamento com um atraso morto no fim. Aqui o painel é uma grade de uma
   linha que vai de 0fr a 1fr: o navegador interpola até a altura exata do
   conteúdo, sem número mágico, e sem animar `height` — que o piso de craft
   deste projeto proíbe. */

export type Setor = {
  nome: string;
  texto: string;
};

/* Ícones minimalistas, mesmo traço de 1,5 e mesmas terminações. */
const ICONES: Record<number, React.ReactNode> = {
  /* contêiner — logística */
  0: (
    <>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </>
  ),
  /* fábrica — indústria */
  1: (
    <>
      <path d="M3 21V10l5.5 3.5V10L14 13.5V7l7 4v10z" />
      <path d="M7 17.5h2M13 17.5h2M18 17.5h1" />
    </>
  ),
  /* prédio — imobiliário */
  2: (
    <>
      <path d="M4 21V5.5L13 3v18M13 21h7V9.5L13 8" />
      <path d="M7.5 8h2M7.5 12h2M7.5 16h2M16 13h1.5M16 17h1.5" />
    </>
  ),
  /* capelo — educação */
  3: (
    <>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5z" />
      <path d="M6.5 11v4.8c0 1.5 2.6 2.7 5.5 2.7s5.5-1.2 5.5-2.7V11" />
      <path d="M21.5 8.5V14" />
    </>
  ),
  /* sino de recepção — hotelaria */
  4: (
    <>
      <path d="M3 17.5h18" />
      <path d="M5 14.5a7 7 0 0 1 14 0z" />
      <path d="M12 7.5v-2M10.4 5.5h3.2" />
    </>
  ),
  /* carrinho — varejo */
  5: (
    <>
      <path d="M2.5 3.5h2.2l2.3 11h10.4l2.1-7.6H6.2" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="17.2" cy="19" r="1.4" />
    </>
  ),
};

export function SetoresAcordeao({ setores }: { setores: Setor[] }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const base = useId();
  const listaRef = useRef<HTMLUListElement>(null);

  /* Setas navegam entre os cabeçalhos, com escopo no componente — nada de
     ouvinte global, que sequestraria as setas no resto da página. */
  const aoTeclar = (ev: React.KeyboardEvent, i: number) => {
    const teclas = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!teclas.includes(ev.key)) return;
    const botoes = listaRef.current?.querySelectorAll<HTMLButtonElement>(
      "[data-setor-botao]",
    );
    if (!botoes?.length) return;
    const ult = botoes.length - 1;
    const alvo =
      ev.key === "ArrowDown"
        ? Math.min(i + 1, ult)
        : ev.key === "ArrowUp"
          ? Math.max(i - 1, 0)
          : ev.key === "Home"
            ? 0
            : ult;
    botoes[alvo]?.focus();
    ev.preventDefault();
  };

  return (
    <ul className="setores" ref={listaRef}>
      {setores.map((s, i) => {
        const estaAberto = aberto === s.nome;
        const idBotao = `${base}-b${i}`;
        const idPainel = `${base}-p${i}`;
        return (
          <li
            key={s.nome}
            className={`setorItem${estaAberto ? " aberto" : ""}`}
          >
            {/* h3 em volta do botão: o nome do setor é um título de conteúdo,
                e sem ele o leitor de tela não consegue navegar por cabeçalhos */}
            <h3>
              <button
                type="button"
                data-setor-botao
                id={idBotao}
                aria-expanded={estaAberto}
                aria-controls={idPainel}
                onClick={() => setAberto(estaAberto ? null : s.nome)}
                onKeyDown={(ev) => aoTeclar(ev, i)}
              >
                <span className="setorIcone" aria-hidden>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONES[i]}
                  </svg>
                </span>

                <span className="setorNome">{s.nome}</span>

                {/* o sinal é desenhado, não escrito: assim a barra vertical
                    some girando e o + vira − sem troca de glifo */}
                <span className="setorSinal" aria-hidden>
                  <i />
                  <i />
                </span>
              </button>
            </h3>

            <div
              className="setorPainel"
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
            >
              <div className="setorPainelInterno">
                <p>{s.texto}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
