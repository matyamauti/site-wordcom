"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/* Anel 3D das soluções — WordCom.

   Porte do CircularCarousel do React Bits, variante JS-CSS, preset "cylinder"
   (registro: https://reactbits.dev/r/CircularCarousel-JS-CSS.json).

   O original monta um anel de FOTOS: cada item vira um <img> fatiado em até
   oito peças que acompanham a curvatura do cilindro. Aqui os itens são os
   cards de serviço que a seção já tinha — texto, não imagem. Daí as diferenças.

   PRESERVADO do original, porque é o que faz o anel funcionar:
   - raio calculado por corda/arco em função da contagem de itens
   - rotateY(posição) + translateZ(raio), com a câmera recuada em -raio
   - medição de encaixe: o palco é escalado para o anel caber na caixa, projetando
     os cantos do card em todos os ângulos
   - arraste por ponteiro com limiar, amostragem de velocidade e mola
     (SPRING / SETTLE_SPEED), mais inércia por momentum
   - snap ao item mais próximo
   - sombra por profundidade (--anel-fundo), que é o que dá volume ao anel
   - parallax de ponteiro no yaw/pitch
   - laço de rAF que dorme: fora da tela ou com a aba oculta, não roda

   MUDADO, e por quê:
   1. Card plano, peça única (curve 0). Fatiar texto em oito tiras não tem
      sentido — a curvatura existe para dobrar fotografia.
   2. Sem face traseira. O original espelha o item para o verso; texto
      espelhado é ilegível. backface-visibility esconde o verso.
   3. Sem espera de imagem: não há imagem para decodificar.
   4. Sem legenda e sem contador. O card já traz número e título.
   5. Giro automático lento, suspenso durante interação e fora da tela.
   6. Cards que não estão de frente recebem inert. Sem isso o Tab entra no link
      de um card que está de costas. */

export type Servico = {
  n: string;
  titulo: string;
  texto: string;
};

/* números do preset "cylinder" do original */
const INCLINACAO = -5;
const PERSPECTIVA = 2500;
const VAO = 28;

/* Física. A mola é criticamente amortecida: `amortece = 2·√MOLA` dá razão de
   amortecimento 1.0, e ω = √118 ≈ 10,9 rad/s dá tempo de resposta ~0,4s. É o
   par que a Apple usa para reposicionamento (damping 1.0 / response 0.4),
   segundo a skill apple-design. Anel que gira é reposicionamento, não
   arremesso — por isso não leva repique. */
const MOLA = 118;
const VEL_REPOUSO = 9;
const LIMIAR_ARRASTE = 5;
const MOMENTO = 0.6;

/* Projeção de momento da Apple (Designing Fluid Interfaces). O ponto de parada
   não é onde o dedo soltou: é onde a inércia levaria. Decaimento exponencial —
   a skill avisa explicitamente que a fórmula v²/2a dos livros NÃO é a que a
   Apple usa. 0.998 é o decaimento de rolagem normal. */
const DESACELERACAO = 0.998;
const projetar = (v: number) =>
  ((v / 1000) * DESACELERACAO) / (1 - DESACELERACAO);
const PARALLAX = 0.3;
const PROF_SOMBRA = 0.55;
const SUBIDA_MS = 1400;
const GIRO_AUTOMATICO = 8;

const RAD = Math.PI / 180;

const limitar = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const voltar = (graus: number) => ((((graus + 180) % 360) + 360) % 360) - 180;

const saidaQuinta = (t: number) => 1 - Math.pow(1 - t, 5);

const girarX = (p: number[], graus: number) => {
  const r = graus * RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};

const girarY = (p: number[], graus: number) => {
  const r = graus * RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

type Props = {
  servicos: Servico[];
  /* Medidas em px, iguais para os seis. A proporção 0,754 é a das artes já
     convertidas (700×928), para a imagem preencher o card sem recorte. */
  largura?: number;
  altura?: number;
};

export function SolucoesAnel({
  servicos,
  largura = 276,
  altura = 366,
}: Props) {
  const total = servicos.length;
  const passo = 360 / total;

  /* corda e arco do original com curve = 0, ou seja só a corda */
  const raio = Math.max(
    (largura + VAO) / (2 * Math.sin(Math.PI / Math.max(total, 3))),
    largura * 0.6,
  );

  const raizRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const aroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const acordarRef = useRef<() => void>(() => {});
  const medirRef = useRef<() => void>(() => {});
  const ativoRef = useRef(0);
  const [ativo, setAtivo] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [quieto, setQuieto] = useState(false);

  const estadoRef = useRef({
    angulo: 0,
    velocidade: 0,
    alvo: null as number | null,
    toque: null as null | {
      id: number;
      x: number;
      y: number;
      angulo: number;
      moveu: boolean;
      origem: number;
      amostras: { t: number; a: number }[];
    },
    arrasto: false,
    ponteiro: { dentro: false, x: 0, y: 0 },
    yaw: 0,
    pitch: 0,
    subida: null as null | { inicio: number },
    subiu: false,
    reterAte: 0,
    engolirClique: false,
    encaixe: 1,
    desloca: 0,
    queda: 0,
    ultimo: 0,
    quieto: false,
    focado: false,
  });

  /* As medidas vivem num ref porque o laço de rAF e os manipuladores de
     ponteiro leem sempre o valor corrente, sem recriar o efeito. A escrita fica
     num efeito de layout, não no render: gravar em ref durante o render é o que
     o original do React Bits faz, mas desorganiza a ordem com o modo
     concorrente — e o ESLint do projeto proíbe. */
  const medidasRef = useRef({ total, passo, raio, largura, altura });

  useLayoutEffect(() => {
    const raiz = raizRef.current;
    const palco = palcoRef.current;
    const camera = cameraRef.current;
    const aro = aroRef.current;
    if (!raiz || !palco || !camera || !aro) return undefined;

    const estado = estadoRef.current;
    estado.quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let naTela = false;

    const maisProximo = (a: number) =>
      Math.round(a / medidasRef.current.passo) * medidasRef.current.passo;

    /* Encaixe: projeta os quatro cantos do card em todos os ângulos do anel e
       escala o palco para o conjunto caber na caixa. É isso que impede o anel
       de estourar a seção em telas estreitas. */
    const medir = () => {
      const m = medidasRef.current;
      const r = raiz.getBoundingClientRect();
      if (!r.width || !r.height) return;

      const larg = r.width * 0.94;
      const alt = r.height * 0.92;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      const cantos = [
        [-m.largura / 2, -m.altura / 2],
        [m.largura / 2, -m.altura / 2],
        [-m.largura / 2, m.altura / 2],
        [m.largura / 2, m.altura / 2],
      ];

      for (let a = -180; a <= 180; a += 7.5) {
        for (const [cx, cy] of cantos) {
          let p = girarY([cx, cy, m.raio], a);
          p = [p[0], p[1], p[2] - m.raio];
          p = girarX(p, INCLINACAO);
          if (p[2] >= PERSPECTIVA * 0.95) continue;
          const k = PERSPECTIVA / (PERSPECTIVA - p[2]);
          minX = Math.min(minX, p[0] * k);
          maxX = Math.max(maxX, p[0] * k);
          minY = Math.min(minY, p[1] * k);
          maxY = Math.max(maxY, p[1] * k);
        }
      }

      const vaoX = Math.max(maxX - minX, 1);
      const vaoY = Math.max(maxY - minY, 1);
      const encaixe = Math.min(1, larg / vaoX, alt / vaoY);
      estado.encaixe = encaixe;
      estado.desloca = -((minY + maxY) / 2) * encaixe;
      estado.queda = (r.height / encaixe) * 0.55 + m.altura;

      palco.style.perspective = `${PERSPECTIVA}px`;
      palco.style.transform = `translate3d(0, ${estado.desloca}px, 0) scale(${encaixe})`;
    };
    medirRef.current = medir;

    /* "rise": o card sobe para o lugar, com atraso proporcional à distância que
       ele tem de percorrer até a frente. Só dispara quando a seção aparece —
       abaixo da dobra, uma entrada no mount acontece sem ninguém ver. */
    const subidaDo = (decorrido: number, base: number) => {
      if (!estado.subida) return 0;
      const alcance = Math.abs(voltar(base + estado.angulo));
      const atraso = (alcance / 180) * 480;
      const p = saidaQuinta(limitar((decorrido - atraso) / 900, 0, 1));
      return (1 - p) * estado.queda;
    };

    const avancar = (dt: number, agora: number) => {
      if (estado.subida && agora - estado.subida.inicio >= SUBIDA_MS) {
        estado.subida = null;
        estado.subiu = true;
      }

      let ocupado = Boolean(estado.subida) || estado.arrasto;

      if (estado.arrasto || estado.subida) {
        if (!estado.arrasto) estado.velocidade = 0;
      } else if (estado.alvo !== null) {
        /* mola crítica do original, integrada em passos fixos */
        let resta = dt;
        const amortece = 2 * Math.sqrt(MOLA);
        while (resta > 0) {
          const h = Math.min(resta, 1 / 240);
          const acel =
            MOLA * (estado.alvo - estado.angulo) - amortece * estado.velocidade;
          estado.velocidade += acel * h;
          estado.angulo += estado.velocidade * h;
          resta -= h;
        }
        if (
          Math.abs(estado.alvo - estado.angulo) < 0.004 &&
          Math.abs(estado.velocidade) < 0.03
        ) {
          estado.angulo = estado.alvo;
          estado.velocidade = 0;
          estado.alvo = null;
        }
        ocupado = true;
      } else if (
        !estado.quieto &&
        !estado.focado &&
        !estado.toque &&
        !estado.ponteiro.dentro &&
        agora >= estado.reterAte &&
        Math.abs(estado.velocidade) < 0.01
      ) {
        estado.angulo -= GIRO_AUTOMATICO * dt;
        ocupado = true;
      } else if (Math.abs(estado.velocidade) > 0.01) {
        const tau = 0.18 + MOMENTO * 1.5;
        estado.velocidade += (0 - estado.velocidade) * (1 - Math.exp(-dt / tau));
        estado.angulo += estado.velocidade * dt;
        if (Math.abs(estado.velocidade) < VEL_REPOUSO) {
          estado.alvo = maisProximo(estado.angulo);
        }
        ocupado =
          ocupado ||
          Math.abs(estado.velocidade) > 0.01 ||
          estado.alvo !== null;
      }

      if (agora < estado.reterAte) ocupado = true;

      const suave = 1 - Math.exp(-dt / 0.35);
      const forca = estado.quieto ? 0 : PARALLAX;
      const miraYaw = estado.ponteiro.dentro ? estado.ponteiro.x * forca * 9 : 0;
      const miraPitch = estado.ponteiro.dentro
        ? -estado.ponteiro.y * forca * 6
        : 0;
      estado.yaw += (miraYaw - estado.yaw) * suave;
      estado.pitch += (miraPitch - estado.pitch) * suave;
      if (
        Math.abs(miraYaw - estado.yaw) > 0.01 ||
        Math.abs(miraPitch - estado.pitch) > 0.01
      ) {
        ocupado = true;
      }

      return ocupado;
    };

    const desenhar = (agora: number) => {
      const m = medidasRef.current;
      const decorrido = estado.subida ? agora - estado.subida.inicio : 0;

      camera.style.transform = `translate3d(0, 0, ${-m.raio}px) rotateX(${
        INCLINACAO + estado.pitch
      }deg) rotateY(${estado.yaw}deg)`;
      aro.style.transform = `rotateY(${estado.angulo}deg)`;

      for (let i = 0; i < m.total; i += 1) {
        const card = cardsRef.current[i];
        if (!card) continue;
        const base = i * m.passo;
        const sobe = subidaDo(decorrido, base);

        let t = `rotateY(${base}deg) translateZ(${m.raio}px)`;
        if (sobe) t += ` translateY(${sobe}px)`;
        card.style.transform = t;

        /* quanto o card está virado de frente: 1 de frente, -1 de costas */
        const mundo = voltar(base + estado.angulo);
        const frente = Math.cos(mundo * RAD);
        const fundo = PROF_SOMBRA * Math.pow((1 - frente) / 2, 1.25);
        card.style.setProperty("--anel-fundo", fundo.toFixed(3));

        /* sem isto o Tab entra no link de um card que está de costas */
        const deFrente = Math.abs(mundo) < m.passo * 0.75;
        if (deFrente) card.removeAttribute("inert");
        else card.setAttribute("inert", "");
      }

      const i =
        ((Math.round(-estado.angulo / m.passo) % m.total) + m.total) % m.total ||
        0;
      if (i !== ativoRef.current) {
        ativoRef.current = i;
        setAtivo(i);
      }
    };

    const quadro = (agora: number) => {
      raf = 0;
      const dt = estado.ultimo ? Math.min((agora - estado.ultimo) / 1000, 0.05) : 1 / 60;
      estado.ultimo = agora;
      const ocupado = avancar(dt, agora);
      desenhar(agora);
      if (ocupado && naTela && !document.hidden) raf = requestAnimationFrame(quadro);
      else estado.ultimo = 0;
    };

    const acordar = () => {
      if (!raf && naTela && !document.hidden) raf = requestAnimationFrame(quadro);
    };
    acordarRef.current = acordar;

    const dormir = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      estado.ultimo = 0;
    };

    const aoTrocarAba = () => {
      if (document.hidden) dormir();
      else acordar();
    };

    const observaTamanho = new ResizeObserver(() => {
      medir();
      acordar();
    });
    observaTamanho.observe(raiz);

    const observaTela = new IntersectionObserver(([entrada]) => {
      naTela = entrada.isIntersecting;
      if (!naTela) {
        dormir();
        return;
      }
      /* a entrada "rise" dispara aqui, na primeira vez que a seção aparece */
      if (!estado.subiu && !estado.quieto) {
        estado.subida = { inicio: performance.now() };
      } else {
        estado.subiu = true;
      }
      acordar();
    });
    observaTela.observe(raiz);

    document.addEventListener("visibilitychange", aoTrocarAba);

    medir();
    desenhar(performance.now());

    return () => {
      dormir();
      observaTamanho.disconnect();
      observaTela.disconnect();
      document.removeEventListener("visibilitychange", aoTrocarAba);
    };
  }, [quieto]);

  useLayoutEffect(() => {
    medidasRef.current = { total, passo, raio, largura, altura };
    medirRef.current();
    acordarRef.current();
  }, [total, passo, raio, largura, altura]);

  const focarEm = useCallback((i: number) => {
    const estado = estadoRef.current;
    const m = medidasRef.current;
    let alvo = -i * m.passo;
    alvo += 360 * Math.round((estado.angulo - alvo) / 360);
    estado.alvo = alvo;
    estado.reterAte = performance.now() + 2800;
    acordarRef.current();
  }, []);

  const andar = useCallback((delta: number) => {
    const estado = estadoRef.current;
    const m = medidasRef.current;
    const base = estado.alvo ?? Math.round(estado.angulo / m.passo) * m.passo;
    estado.alvo = base - delta * m.passo;
    estado.reterAte = performance.now() + 2800;
    acordarRef.current();
  }, []);

  const lerPonteiro = (ev: React.PointerEvent) => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const r = raiz.getBoundingClientRect();
    const p = estadoRef.current.ponteiro;
    p.x = limitar(((ev.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    p.y = limitar(((ev.clientY - r.top) / r.height) * 2 - 1, -1, 1);
  };

  const aoPressionar = (ev: React.PointerEvent) => {
    const estado = estadoRef.current;
    estado.engolirClique = false;
    if (ev.button !== 0) return;
    estado.toque = {
      id: ev.pointerId,
      x: ev.clientX,
      y: ev.clientY,
      angulo: estado.angulo,
      moveu: false,
      origem: 0,
      amostras: [{ t: performance.now(), a: estado.angulo }],
    };
  };

  const aoMover = (ev: React.PointerEvent) => {
    const estado = estadoRef.current;
    if (ev.pointerType === "mouse") {
      estado.ponteiro.dentro = true;
      lerPonteiro(ev);
    }
    const toque = estado.toque;
    if (!toque || toque.id !== ev.pointerId) {
      acordarRef.current();
      return;
    }
    const m = medidasRef.current;
    const dx = ev.clientX - toque.x;
    const dy = ev.clientY - toque.y;

    if (!toque.moveu) {
      if (Math.abs(dx) < LIMIAR_ARRASTE) return;
      /* dedo descendo é rolagem da página, não giro do anel */
      if (Math.abs(dy) > Math.abs(dx) * 1.2 && ev.pointerType !== "mouse") {
        estado.toque = null;
        return;
      }
      toque.moveu = true;
      toque.origem = dx;
      estado.arrasto = true;
      estado.alvo = null;
      estado.velocidade = 0;
      setArrastando(true);
      try {
        raizRef.current?.setPointerCapture(ev.pointerId);
      } catch {}
    }

    const porPixel = 180 / (Math.PI * m.raio * estado.encaixe);
    estado.angulo = toque.angulo + (dx - toque.origem) * porPixel;
    const agora = performance.now();
    toque.amostras.push({ t: agora, a: estado.angulo });
    while (toque.amostras.length > 2 && agora - toque.amostras[0].t > 110) {
      toque.amostras.shift();
    }
    acordarRef.current();
  };

  const aoSoltar = (ev: React.PointerEvent) => {
    const estado = estadoRef.current;
    const toque = estado.toque;
    if (!toque || toque.id !== ev.pointerId) return;
    estado.toque = null;
    estado.reterAte = performance.now() + 2800;
    acordarRef.current();
    if (!toque.moveu) return;
    estado.arrasto = false;
    setArrastando(false);
    estado.engolirClique = true;

    const m = medidasRef.current;
    const primeira = toque.amostras[0];
    const ultima = toque.amostras[toque.amostras.length - 1];
    const vao = (ultima.t - primeira.t) / 1000;
    const vel =
      vao > 0.008 ? limitar((ultima.a - primeira.a) / vao, -1400, 1400) : 0;
    estado.velocidade = vel;

    /* A parada vem da projeção, não de um fator inventado: o anel pousa onde a
       inércia o levaria, e só então encaixa no item mais próximo DAQUELE ponto.
       É o que faz um peteleco parecer arremesso em vez de empurrão. */
    const projetado = estado.angulo + projetar(vel);
    estado.alvo = Math.round(projetado / m.passo) * m.passo;
    acordarRef.current();
  };

  const aoSair = (ev: React.PointerEvent) => {
    const estado = estadoRef.current;
    if (ev.pointerType === "mouse") estado.ponteiro.dentro = false;
    acordarRef.current();
  };

  const aoClicar = (ev: React.MouseEvent) => {
    const estado = estadoRef.current;
    if (estado.engolirClique) {
      estado.engolirClique = false;
      return;
    }
    const destino = ev.target as HTMLElement;
    /* clique no link do card tem de navegar, não girar o anel */
    if (destino.closest("a")) return;
    const card = destino.closest("[data-anel-i]");
    if (!card) return;
    focarEm(Number(card.getAttribute("data-anel-i")));
  };

  const aoTeclar = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowRight") andar(1);
    else if (ev.key === "ArrowLeft") andar(-1);
    else if (ev.key === "Home") focarEm(0);
    else if (ev.key === "End") focarEm(total - 1);
    else return;
    ev.preventDefault();
  };

  /* Movimento reduzido: grade estática com os seis serviços legíveis. Nada
     depende de arraste para existir. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setQuieto(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  if (quieto) {
    return (
      <div className="anelGrade">
        {servicos.map((s) => (
          <a
            key={s.n}
            href="#contato"
            aria-label={`Falar sobre ${s.titulo.replace(/&/g, "e")}`}
          >
            <Image
              src={`/midia/cards-direcao/servico-${s.n}.webp`}
              alt={`${s.n} — ${s.titulo}`}
              width={700}
              height={928}
              sizes="(max-width: 760px) 70vw, 300px"
            />
          </a>
        ))}
      </div>
    );
  }

  const anel = (
    <div
      ref={raizRef}
      className="anel"
      style={
        {
          "--anel-largura": `${largura}px`,
          "--anel-altura": `${altura}px`,
        } as React.CSSProperties
      }
      role="group"
      aria-roledescription="carrossel"
      aria-label="Soluções WordCom, use as setas para girar"
      tabIndex={0}
      data-arrastando={arrastando ? "" : undefined}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onPointerLeave={aoSair}
      onClick={aoClicar}
      onKeyDown={aoTeclar}
    >
      <div className="anelPalco" ref={palcoRef}>
        <div className="anelCamera" ref={cameraRef}>
          <div className="anelAro" ref={aroRef}>
            {servicos.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="anelCard"
                data-anel-i={i}
              >
                {/* A arte já traz número, nome e seta desenhados. Como o texto
                    virou pixel, o nome entra também como <h3> oculto para
                    continuar existindo no documento — e o índice ao lado carrega
                    as seis descrições em HTML de verdade. */}
                <article>
                  <Image
                    src={`/midia/cards-direcao/servico-${s.n}.webp`}
                    alt={`${s.n} — ${s.titulo}`}
                    width={700}
                    height={928}
                    sizes="(max-width: 760px) 70vw, 300px"
                    draggable={false}
                  />
                  <h3 className="soLeitor">{s.titulo}</h3>
                  {/* a seta está dentro da imagem; o alvo de clique vai por cima
                      dela, em porcentagem, medido em 89,5% × 12% do card */}
                  <a
                    className="anelSeta"
                    href="#contato"
                    aria-label={`Falar sobre ${s.titulo.replace(/&/g, "e")}`}
                  />
                </article>
                <div className="anelSombra" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="anelVivo" aria-live="off" aria-atomic="true">
        {`${servicos[ativo]?.titulo ?? ""}, ${ativo + 1} de ${total}`}
      </p>
    </div>
  );

  /* Duas colunas: o anel à esquerda é o elemento visual, o índice à direita é a
     substância. Antes só dava para ler um serviço por vez — era isso que
     deixava a seção vazia. Os itens do índice também giram o anel: a lista é a
     navegação dele, o que dá ao conteúdo duplicado uma função real. */
  return (
    <div
      className="solucoesDupla"
      onFocusCapture={() => {
        estadoRef.current.focado = true;
        acordarRef.current();
      }}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        estadoRef.current.focado = false;
        estadoRef.current.reterAte = performance.now() + 2800;
        acordarRef.current();
      }}
    >
      {anel}
      <ol className="solucoesIndice">
        {servicos.map((s, i) => (
          <li key={s.n}>
            <button
              type="button"
              onClick={() => focarEm(i)}
              aria-current={i === ativo ? "true" : undefined}
            >
              <span className="indiceN">{s.n}</span>
              <span className="indiceCorpo">
                <strong>{s.titulo}</strong>
                <span>{s.texto}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
