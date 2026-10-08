"use client";

import { useState } from "react";

/* Carrossel de cases — reimplementação do comportamento que o site já tinha.
   Os três cases e as três cores (orange / purple / pink) são os do original.

   Melhorias sem efeito visual:
   - aria-live na região de texto: quem usa leitor de tela passa a saber que o
     conteúdo mudou ao acionar as setas. Antes, o botão funcionava e nada era
     anunciado.
   - aria-label nos botões já existia no original e foi mantido.
   - o contador "01 / 03" ganhou um texto de leitor de tela explicando que é
     posição, porque "01 / 03" sozinho é anunciado como "um barra três".
   Não há rotação automática, então não é preciso controle de pausa. */

const cases = [
  {
    cor: "orange",
    frentes: "Branding · Embalagens · Digital",
    titulo: "Construção e lançamento de marca",
    destaque: "Identidade aplicada em 90 dias",
    texto:
      "Da criação da marca aos rótulos, embalagens, site e materiais necessários para entrar no mercado com consistência.",
  },
  {
    cor: "purple",
    frentes: "Campanha · Mídia · Conteúdo",
    titulo: "Presença integrada em múltiplos canais",
    destaque: "ON + OFF na mesma direção",
    texto:
      "Planejamento, criação e distribuição conectados para ampliar presença e manter unidade em todos os pontos de contato.",
  },
  {
    cor: "pink",
    frentes: "Audiovisual · Conteúdo · Distribuição",
    titulo: "Conteúdo que constrói autoridade",
    destaque: "Produção multiplataforma",
    texto:
      "Programas, filmes, entrevistas, podcasts e conteúdos digitais desenvolvidos para aproximar marcas de seus públicos.",
  },
];

export function CasesCarrossel() {
  const [i, setI] = useState(0);
  const c = cases[i];
  const total = cases.length;
  const numero = String(i + 1).padStart(2, "0");

  const anterior = () => setI((v) => (v - 1 + total) % total);
  const proximo = () => setI((v) => (v + 1) % total);

  return (
    <div className={`caseCarousel ${c.cor}`}>
      <div className="carouselVisual">
        <i aria-hidden />
        <span aria-hidden>{numero}</span>
      </div>
      <div className="carouselText" aria-live="polite">
        <small>{c.frentes}</small>
        <h3>{c.titulo}</h3>
        <strong>{c.destaque}</strong>
        <p>{c.texto}</p>
        <a href="#contato" aria-label={`Falar sobre o case: ${c.titulo}`}>
          Conheça o case ↗
        </a>
        <div className="carouselControls">
          <button type="button" aria-label="Case anterior" onClick={anterior}>
            ←
          </button>
          <span>
            <span aria-hidden>
              {numero} / {String(total).padStart(2, "0")}
            </span>
            <span className="soLeitor">
              Case {i + 1} de {total}
            </span>
          </span>
          <button type="button" aria-label="Próximo case" onClick={proximo}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
