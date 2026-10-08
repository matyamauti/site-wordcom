"use client";

import { useEffect, useRef, useState } from "react";
import LineWaves from "./ui/line-waves";

/* Fundo de ondas das seções claras.

   O LineWaves em si está vendorizado sem alteração em ui/line-waves.jsx. Este
   invólucro existe porque ele, sozinho, tem dois problemas quando aparece
   quatro vezes na mesma página:

   1. CADA INSTÂNCIA É UM CONTEXTO WebGL, e o laço de rAF dele nunca para — nem
      fora da tela, nem com a aba oculta. Quatro contextos desenhando um shader
      de tela cheia a 60fps o tempo todo esquentam a máquina sem ninguém ver.
      Aqui o componente só é MONTADO quando a seção se aproxima, e desmontado
      quando ela sai. O cleanup dele já chama WEBGL_lose_context, então o
      contexto é devolvido de verdade.

   2. NÃO TEM prefers-reduced-motion. Um fundo em movimento contínuo é
      exatamente o que quem pede menos movimento não quer. Com a preferência
      ligada, ele não monta — fica o fundo liso da seção.

   lightMode fica DESLIGADO, a pedido do dono: assim o shader emite linhas de
   cor com alfa sobre transparência (linha 144 do shader), e não um fundo branco
   opaco (linha 142). As quatro seções passam a ser escuras, com as ondas
   acesas por cima. */

export function FundoOndas() {
  const ref = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [quieto, setQuieto] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setQuieto(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => setPerto(e.isIntersecting),
      /* monta um pouco antes de entrar, para não aparecer do nada */
      { rootMargin: "300px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fundoOndas" ref={ref} aria-hidden>
      {perto && !quieto && (
        <LineWaves
          speed={0.1}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1.0}
          rotation={-45}
          edgeFadeWidth={0.0}
          colorCycleSpeed={3.2}
          brightness={0.2}
          color1="#8c00ff"
          color2="#ff6800"
          color3="#44171f"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
        />
      )}
    </div>
  );
}
