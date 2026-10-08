"use client";

import { useEffect, useRef } from "react";

/* Hero em sequência de quadros — WordCom.

   O filme da marca fatiado em 240 WebP, desenhados num <canvas> cuja posição
   de reprodução é a própria rolagem da página. Porte do motor que estava em
   public/hero-animada/index.html, construído a partir da skill animated-website.

   O que foi PRESERVADO do motor original, porque é o que o faz não engasgar:
   - carregamento em lotes, quadros críticos primeiro
   - nearestLoaded(): se o quadro pedido ainda não chegou, desenha o mais
     próximo que já está em memória. É isso que evita canvas em branco
   - desenho em cover mantendo proporção
   - remapeamento de dwell: cria zonas lentas em volta de cada frase sem
     travar a reprodução entre elas
   - LERP no quadro desenhado, para o scroll não aparecer como degrau
   - visibilidade de capítulo pelo progresso SEM suavização (se usasse o
     suavizado, o texto entraria defasado da imagem)
   - DPR limitado a 2 e laço parado com a aba oculta

   O que MUDOU em relação à página de teste:
   1. Sem tela de carregamento. A página libera assim que o quadro 0 chega e o
      resto baixa por trás. Numa home, tela de espera custa visita.
   2. Sem régua de quadros e sem "role para descer" — pedido do dono.
   3. Mobile usa um filme vertical exclusivo: o simbolo se desenvolve no polvo.
      O filme original com o nome fica exclusivo do desktop. */

const QUADROS = 240;
const PAD = 4;

/* Quanto o quadro desenhado persegue o alvo a cada tique. Medido: abaixo de
   0.09 a imagem fica tantos quadros atrás que o texto anuncia uma coisa e a
   tela mostra outra. A suavidade vem da densidade de quadros, não daqui. */
const LERP = 0.1;

/* Dwell suave: as três frases estão todas no trecho final, e com pico alto a
   densidade do fim engoliria o orçamento de rolagem — o começo do filme
   passaria correndo. */
const DWELL_LARGURA = 0.055;
const DWELL_PICO = 1.15;
const LUT = 2400;

const MQ_MOBILE = "(max-width: 780px)";
const MQ_QUIETO = "(prefers-reduced-motion: reduce)";

/* Centros das frases, no trecho final. A primeira metade do filme corre limpa:
   a marca aparece, dissolve e a criatura se forma, sem nada por cima. */
const CENTROS = [0.56, 0.72, 0.86];

export function HeroSequencia() {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const trilha = trilhaRef.current;
    const palco = palcoRef.current;
    const canvas = canvasRef.current;
    if (!trilha || !palco || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const capitulos = Array.from(
      trilha.querySelectorAll<HTMLElement>("[data-centro]"),
    );
    const quieto = window.matchMedia(MQ_QUIETO).matches;
    const mqMobile = window.matchMedia(MQ_MOBILE);

    const criarAcervo = (pasta: string) => ({
      pasta,
      imagens: new Array<HTMLImageElement | null>(QUADROS),
      prontos: new Uint8Array(QUADROS),
      promessas: new Array<Promise<HTMLImageElement | null> | null>(QUADROS),
    });
    type Acervo = ReturnType<typeof criarAcervo>;

    const acervos = {
      desktop: criarAcervo("/midia/sequencia/desktop"),
      mobile: criarAcervo("/midia/sequencia/mobile-polvo"),
    };

    let usaMobile = mqMobile.matches;
    let acervo: Acervo = usaMobile ? acervos.mobile : acervos.desktop;
    let quadroAtual = 0;
    let ultimoDesenhado = -1;
    let paginaVisivel = true;
    let raf = 0;
    let trilhaTopo = 0;
    let trilhaCurso = 1;
    let vivo = true;

    const visibilidade = new WeakMap<HTMLElement, boolean>();

    const url = (i: number, a: Acervo) =>
      `${a.pasta}/frame-${String(i + 1).padStart(PAD, "0")}.webp`;

    function carregar(i: number, a: Acervo = acervo, tentativas = 1) {
      if (a.prontos[i]) return Promise.resolve(a.imagens[i]);
      const emCurso = a.promessas[i];
      if (emCurso) return emCurso;

      const p = new Promise<HTMLImageElement | null>((resolve) => {
        const tentar = (restantes: number) => {
          const img = new Image();
          a.imagens[i] = img;
          img.decoding = "async";
          img.onload = () => {
            a.prontos[i] = 1;
            resolve(img);
          };
          img.onerror = () => {
            if (restantes > 0) window.setTimeout(() => tentar(restantes - 1), 140);
            else {
              a.imagens[i] = null;
              a.promessas[i] = null;
              resolve(null);
            }
          };
          img.src = url(i, a);
        };
        tentar(tentativas);
      });
      a.promessas[i] = p;
      return p;
    }

    async function carregarEmLotes(indices: number[], tam = 8, a: Acervo = acervo) {
      for (let i = 0; i < indices.length; i += tam) {
        if (!vivo) return;
        await Promise.all(indices.slice(i, i + tam).map((n) => carregar(n, a)));
      }
    }

    /* o que impede canvas em branco: desenha o vizinho já carregado */
    function maisProximoPronto(i: number, a: Acervo = acervo) {
      if (a.prontos[i]) return i;
      for (let d = 1; d < QUADROS; d += 1) {
        if (i - d >= 0 && a.prontos[i - d]) return i - d;
        if (i + d < QUADROS && a.prontos[i + d]) return i + d;
      }
      return -1;
    }

    function redimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(palco!.clientWidth * dpr);
      const h = Math.round(palco!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        ultimoDesenhado = -1;
      }
    }

    function medirTrilha() {
      const r = trilha!.getBoundingClientRect();
      trilhaTopo = window.scrollY + r.top;
      trilhaCurso = Math.max(1, r.height - window.innerHeight);
    }

    function desenhar(i: number) {
      const n = maisProximoPronto(Math.max(0, Math.min(QUADROS - 1, i)));
      if (n < 0 || n === ultimoDesenhado) return;
      const img = acervo.imagens[n];
      if (!img || !img.naturalWidth) return;

      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.fillStyle = "#0d050f";
      ctx!.fillRect(0, 0, w, h);

      const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      const x = (w - dw) / 2;
      const y = usaMobile ? (h - dh) * 0.42 : (h - dh) / 2;

      ctx!.drawImage(img, x, y, dw, dh);
      ultimoDesenhado = n;
    }

    /* ---- remapeamento de dwell ---------------------------------------- */
    const bruto = new Float64Array(LUT + 1);

    function construirLut() {
      let total = 0;
      const densidade = new Float64Array(LUT + 1);
      for (let i = 0; i <= LUT; i += 1) {
        const efetivo = i / LUT;
        let v = 1;
        for (const c of CENTROS) {
          const d = (efetivo - c) / DWELL_LARGURA;
          v += DWELL_PICO * Math.exp(-0.5 * d * d);
        }
        densidade[i] = v;
        if (i > 0) total += (densidade[i - 1] + v) * 0.5;
        bruto[i] = total;
      }
      for (let i = 0; i <= LUT; i += 1) bruto[i] /= total;
    }

    function remapear(raw: number) {
      let lo = 0;
      let hi = LUT;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (bruto[mid] < raw) lo = mid + 1;
        else hi = mid;
      }
      const i = Math.max(1, lo);
      const span = bruto[i] - bruto[i - 1] || 1;
      const mix = (raw - bruto[i - 1]) / span;
      return Math.max(0, Math.min(1, (i - 1 + mix) / LUT));
    }

    const progressoBruto = () =>
      Math.max(0, Math.min(1, (window.scrollY - trilhaTopo) / trilhaCurso));

    function progressoEfetivo() {
      return remapear(progressoBruto());
    }

    function atualizarCapitulos(efetivo: number) {
      for (const cap of capitulos) {
        const centro = Number(cap.dataset.centro);
        const janela = Number(cap.dataset.janela);
        const visivel = Math.abs(efetivo - centro) <= janela;
        if (visibilidade.get(cap) !== visivel) {
          visibilidade.set(cap, visivel);
          cap.classList.toggle("eVisivel", visivel);
          cap.setAttribute("aria-hidden", String(!visivel));
        }
      }
    }

    function tique() {
      if (!vivo || !paginaVisivel || quieto) return;
      const efetivo = progressoEfetivo();
      const alvo = efetivo * (QUADROS - 1);
      quadroAtual += (alvo - quadroAtual) * LERP;
      desenhar(Math.round(quadroAtual));
      atualizarCapitulos(efetivo);
      raf = requestAnimationFrame(tique);
    }

    async function iniciar() {
      construirLut();
      redimensionar();
      medirTrilha();

      if (quieto) {
        /* movimento reduzido: um quadro fixo e a primeira frase legível.
           Nada fica dependendo de rolagem para existir. */
        const poster = Math.round(0.56 * (QUADROS - 1));
        await carregar(poster);
        quadroAtual = poster;
        desenhar(poster);
        capitulos.forEach((cap, i) => {
          const visivel = i === 0;
          visibilidade.set(cap, visivel);
          cap.classList.toggle("eVisivel", visivel);
          cap.setAttribute("aria-hidden", String(!visivel));
        });
        return;
      }

      const primeiro = 0;
      await carregar(primeiro);
      if (!vivo) return;
      quadroAtual = primeiro;
      desenhar(primeiro);
      tique();

      const criticos = Array.from(
        new Set([primeiro, ...CENTROS.map((c) => Math.round(c * (QUADROS - 1))), QUADROS - 1]),
      ).sort((a, b) => a - b);
      await carregarEmLotes(criticos.filter((n) => n !== primeiro), 4);

      const resto = Array.from({ length: QUADROS }, (_, i) => i).filter(
        (i) => i >= primeiro && !criticos.includes(i),
      );
      carregarEmLotes(resto);
    }

    async function trocarAcervo(ev: MediaQueryListEvent) {
      usaMobile = ev.matches;
      acervo = usaMobile ? acervos.mobile : acervos.desktop;
      ultimoDesenhado = -1;
      redimensionar();
      medirTrilha();
      if (!quieto) quadroAtual = progressoEfetivo() * (QUADROS - 1);
      const n = Math.max(0, Math.min(QUADROS - 1, Math.round(quadroAtual)));
      await carregar(n, acervo);
      if (!vivo) return;
      desenhar(n);
      const porDistancia = Array.from({ length: QUADROS }, (_, i) => i).sort(
        (a, b) => Math.abs(a - n) - Math.abs(b - n),
      );
      carregarEmLotes(porDistancia, 8, acervo);
    }

    const aoRedimensionar = () => {
      redimensionar();
      medirTrilha();
    };
    const aoTrocarAba = () => {
      paginaVisivel = !document.hidden;
      if (paginaVisivel && !quieto) {
        cancelAnimationFrame(raf);
        tique();
      }
    };

    window.addEventListener("resize", aoRedimensionar, { passive: true });
    mqMobile.addEventListener("change", trocarAcervo);
    document.addEventListener("visibilitychange", aoTrocarAba);
    iniciar();

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", aoRedimensionar);
      mqMobile.removeEventListener("change", trocarAcervo);
      document.removeEventListener("visibilitychange", aoTrocarAba);
    };
  }, []);

  return (
    <div className="seqTrilha" id="inicio" ref={trilhaRef}>
      <div className="seqPalco" ref={palcoRef}>
        <canvas
          className="seqCanvas"
          ref={canvasRef}
          role="img"
          aria-label="Filme da marca WordCom: o polvo se aproxima conforme a página rola."
        />
        <div className="seqVeu" aria-hidden />

        <div className="seqFrases">
          <article className="seqFrase" data-centro="0.56" data-janela="0.062">
            <div className="seqCopy">
              <h1 className="seqTitulo revela">
                <span>
                  Somos uma <strong>Agência 360</strong>
                </span>
              </h1>
              <p className="seqApoio revela">
                <span>
                  Publicidade, digital, conteúdo, audiovisual, eventos e imprensa.
                </span>
              </p>
            </div>
          </article>

          <article className="seqFrase" data-centro="0.72" data-janela="0.062">
            <div className="seqCopy">
              <p className="seqTitulo revela">
                <span>Viva a experiência de ser <strong className="tituloDestaque">WordCom</strong></span>
              </p>
            </div>
          </article>

          <article
            className="seqFrase seqFrase--longa"
            data-centro="0.86"
            data-janela="0.062"
          >
            <div className="seqCopy">
              <p className="seqTitulo revela">
                <span>A última <strong className="tituloDestaque">palavra</strong> em comunicação</span>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
