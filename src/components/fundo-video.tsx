"use client";

import { useEffect, useRef, useState } from "react";

/* Vídeo de fundo da seção Estrutura.

   Três cuidados que um <video autoplay loop> solto não tem:

   1. Movimento reduzido: não toca. Quem pede menos movimento não deve receber
      uma animação em laço no fundo da página — fica o quadro parado do poster.

   2. Fora da tela: pausa. Vídeo em laço rodando numa seção que ninguém está
      vendo gasta bateria e CPU à toa.

   3. preload="none": o arquivo só começa a baixar quando a seção se aproxima.
      O poster segura a aparência até lá, e a primeira dobra não disputa banda
      com um vídeo que está a milhares de pixels abaixo. */

type FundoVideoProps = {
  src?: string;
  poster?: string;
  className?: string;
};

export function FundoVideo({
  src,
  poster = "/midia/estrutura/fabrica-poster.webp",
  className = "aboutVideo",
}: FundoVideoProps = {}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ler = () => setQuieto(mq.matches);
    ler();
    mq.addEventListener("change", ler);
    return () => mq.removeEventListener("change", ler);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;

    if (quieto) {
      v.pause();
      return undefined;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          /* o play pode ser recusado pela política de autoplay; sem o catch o
             navegador registra uma promessa rejeitada no console */
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    obs.observe(v);
    return () => {
      obs.disconnect();
      v.pause();
    };
  }, [quieto, src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      /* decorativo: o conteúdo da seção está no texto ao lado */
      aria-hidden
      tabIndex={-1}
    >
      {src ? (
        <source src={src} type="video/mp4" />
      ) : (
        <>
          <source src="/midia/estrutura/fabrica.webm" type="video/webm" />
          <source src="/midia/estrutura/fabrica.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}
