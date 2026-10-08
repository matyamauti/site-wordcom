"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

/* Cases em coverflow 3D.

   As três artes são imagens fechadas: o texto, a marca e até os controles do
   carrossel estão pintados dentro do bitmap. Por isso não há camada de texto
   aqui — ela duplicaria a que já está na arte.

   O preço disso é acessibilidade: texto dentro de imagem não é lido, não é
   selecionável e borra ao ampliar. O `alt` de cada card carrega o conteúdo
   integral, que é o máximo possível sem refazer as artes. O certo é regerar
   as imagens só com a ilustração e trazer o texto de volta para HTML.

   Diferenças deliberadas em relação ao componente de referência:
   - sem autoplay. O carrossel que o site já tinha também não tinha, e sem
     rotação automática não é preciso o controle de pausa que a WCAG exige
     para conteúdo em movimento acima de 5s.
   - a seta do teclado NÃO é capturada no window. No original um listener
     global sequestrava ArrowLeft/ArrowRight da página inteira, inclusive de
     quem estivesse num formulário. Aqui ela só responde com o foco dentro
     do carrossel.
   - transições nomeadas em CSS, nunca `transition: all` em estilo inline. */

type Case = {
  arquivo: string;
  titulo: string;
  alt: string;
};

const cases: Case[] = [
  {
    arquivo: "/cases/case-01.png",
    titulo: "Construção e lançamento de marca",
    alt: "Case: Construção e lançamento de marca. Frentes: branding, embalagens e digital. Identidade aplicada em 90 dias. Da criação da marca aos rótulos, embalagens, site e materiais necessários para entrar no mercado com consistência.",
  },
  {
    arquivo: "/cases/case-02.png",
    titulo: "Presença integrada em múltiplos canais",
    alt: "Case: Presença integrada em múltiplos canais. Frentes: campanha, mídia e conteúdo. ON mais OFF na mesma direção. Planejamento, criação e distribuição conectados para ampliar presença e manter unidade em todos os pontos de contato.",
  },
  {
    arquivo: "/cases/case-03.png",
    titulo: "Conteúdo que constrói autoridade",
    alt: "Case: Conteúdo que constrói autoridade. Frentes: audiovisual, conteúdo e distribuição. Produção multiplataforma. Programas, filmes, entrevistas, podcasts e conteúdos digitais desenvolvidos para aproximar marcas de seus públicos.",
  },
];

const TOTAL = cases.length;
const DISTANCIA_DE_ARRASTO = 45;

export function CasesCoverflow() {
  const [atual, setAtual] = useState(0);
  const toqueX = useRef(0);

  const proximo = useCallback(() => setAtual((i) => (i + 1) % TOTAL), []);
  const anterior = useCallback(() => setAtual((i) => (i - 1 + TOTAL) % TOTAL), []);

  /* posição de cada card em relação ao que está no centro */
  const posicao = (i: number) => {
    const d = (i - atual + TOTAL) % TOTAL;
    if (d === 0) return "centro";
    if (d === 1) return "direita";
    return "esquerda";
  };

  const aoTeclar = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      anterior();
    }
    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      proximo();
    }
  };

  return (
    <div
      className="cases3d"
      role="group"
      aria-roledescription="carrossel"
      aria-label="Cases da WordCom"
      onKeyDown={aoTeclar}
    >
      <div
        className="cases3dPalco"
        onTouchStart={(ev) => {
          toqueX.current = ev.touches[0].clientX;
        }}
        onTouchEnd={(ev) => {
          const d = ev.changedTouches[0].clientX - toqueX.current;
          if (Math.abs(d) <= DISTANCIA_DE_ARRASTO) return;
          if (d < 0) proximo();
          else anterior();
        }}
      >
        {cases.map((c, i) => {
          const pos = posicao(i);
          const noCentro = pos === "centro";
          return (
            /* o card é um contêiner neutro. O que é interativo mora dentro
               dele e muda conforme a posição: o central tem o link do case,
               os laterais têm um botão que cobre a arte inteira e traz o
               card para o centro. Antes o próprio card era <button>, e aí
               o link do CTA ficaria aninhado dentro dele — HTML inválido. */
            <div key={c.arquivo} className="cases3dCard" data-pos={pos}>
              <Image
                src={c.arquivo}
                alt={noCentro ? c.alt : ""}
                width={1448}
                height={1086}
                sizes="(max-width: 760px) 86vw, 620px"
                priority={i === 0}
              />

              {noCentro ? (
                <a className="cases3dCta" href="#contato">
                  Conheça o case
                  {/* ícone desenhado, não a seta unicode: mesma espessura de
                      traço dos controles, então o conjunto tem uma voz só */}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                  <span className="soLeitor">: {c.titulo}</span>
                </a>
              ) : (
                <button
                  type="button"
                  className="cases3dIr"
                  aria-label={`Ver case: ${c.titulo}`}
                  onClick={() => setAtual(i)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="cases3dControles">
        <button type="button" onClick={anterior} aria-label="Case anterior">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 19 8 12l7-7" />
          </svg>
        </button>

        {/* aria-live: sem isso, quem usa leitor de tela aciona a seta e nada
            é anunciado — o controle parece não ter funcionado */}
        <span className="cases3dContador" aria-live="polite">
          <span aria-hidden="true">
            {String(atual + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
          <span className="soLeitor">
            Case {atual + 1} de {TOTAL}
          </span>
        </span>

        <button type="button" onClick={proximo} aria-label="Próximo case">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
