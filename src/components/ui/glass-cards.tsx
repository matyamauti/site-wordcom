"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cardData } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* glass-cards — componente de pilha de cartas de vidro, como recebido.

   Mantido fiel ao original: contêiner de 100vh com position: sticky, carta de
   70% × 450px em position: relative deslocada por `índice × 25px`, escala de 1
   até 1 − (total − índice) × 0,05, ScrollTrigger com start "top center",
   end "bottom center" e scrub: 1, e as cinco camadas de vidro — borda cônica,
   backdrop-filter, reflexo superior, brilho, reflexo lateral e textura fosca.

   DUAS ADIÇÕES, porque o original não as tem:

   1. O componente recebe `title` e `description` e NÃO desenha nenhum dos dois:
      ele é só camada de vidro. Sem conteúdo, as três cartas sairiam vazias.
      Aqui a arte de cada projeto entra dentro da carta, e o nome e a descrição
      ficam no documento como texto para leitor de tela.

   2. A carta virou um link para /projetos/{slug}, que é o comportamento que a
      seção já tinha.

   Nota sobre o original, mantida: o cleanup faz
   ScrollTrigger.getAll().forEach(t => t.kill()), que mata TODOS os gatilhos da
   página, não só os desta carta. Não há outro ScrollTrigger neste projeto, então
   não quebra nada hoje — mas quebraria se houvesse. */

interface CardProps {
  id: number;
  slug: string;
  n: string;
  title: string;
  description: string;
  index: number;
  totalCards: number;
  color: string;
  largura: number;
  altura: number;
}

const Card: React.FC<CardProps> = ({
  slug,
  n,
  title,
  description,
  index,
  totalCards,
  color,
  largura,
  altura,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const targetScale = 1 - (totalCards - index) * 0.05;

    gsap.set(card, {
      scale: 1,
      transformOrigin: "center top",
    });

    const gatilho = ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = gsap.utils.interpolate(1, targetScale, progress);

        gsap.set(card, {
          scale: Math.max(scale, targetScale),
          transformOrigin: "center top",
        });
      },
    });

    return () => {
      gatilho.kill();
    };
  }, [index, totalCards]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: "relative",
          width: "70%",
          height: "450px",
          borderRadius: "24px",
          isolation: "isolate",
          top: `calc(-5vh + ${index * 25}px)`,
          transformOrigin: "top",
        }}
        className="card-content"
      >
        {/* Electric Border Effect */}
        <div
          style={{
            position: "absolute",
            inset: "-3px",
            borderRadius: "27px",
            padding: "3px",
            background: `conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            ${color} 60deg,
                            ${color.replace("0.8", "0.6")} 120deg,
                            transparent 180deg,
                            ${color.replace("0.8", "0.4")} 240deg,
                            transparent 360deg
                        )`,
            zIndex: -1,
          }}
        />

        {/* Main Card Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "24px",
            background: `
                        linear-gradient(145deg,
                            rgba(255, 255, 255, 0.1),
                            rgba(255, 255, 255, 0.05)
                        )
                    `,
            backdropFilter: "blur(25px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        0 2px 8px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                    `,
            overflow: "hidden",
          }}
        >
          {/* ADIÇÃO: a arte do projeto. O original não desenha conteúdo nenhum. */}
          <Link
            href={`/projetos/${slug}`}
            style={{
              position: "relative",
              zIndex: 2,
              display: "block",
              padding: "0 28px",
              lineHeight: 0,
            }}
          >
            <Image
              src={`/midia/projetos/${slug}.webp`}
              alt=""
              width={largura}
              height={altura}
              sizes="(max-width: 860px) 92vw, 820px"
              style={{ width: "100%", height: "auto", borderRadius: "12px" }}
            />
            <span className="glassCardTexto">
              {n} — {title}. {description}
            </span>
          </Link>

          {/* Enhanced Glass reflection overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
              pointerEvents: "none",
              borderRadius: "24px 24px 0 0",
            }}
          />

          {/* Glass shine effect */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              right: "10px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)",
              borderRadius: "1px",
              pointerEvents: "none",
            }}
          />

          {/* Side glass reflection */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "2px",
              height: "100%",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
              borderRadius: "24px 0 0 24px",
              pointerEvents: "none",
            }}
          />

          {/* Frosted glass texture */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 2px),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 2px),
                            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 1px, transparent 2px)
                        `,
              backgroundSize: "30px 30px, 25px 25px, 35px 35px",
              pointerEvents: "none",
              borderRadius: "24px",
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const StackedCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo(
      container,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <div ref={containerRef}>
      {/* A seção de herói do original ficou de fora: ela é o demo da biblioteca
          ("Stacking Glass Cards with GSAP / Scroll down 👇"), não o componente.
          O cabeçalho desta seção já existe na página. */}
      <section style={{ color: "#ffffff", width: "100%" }}>
        {cardData.map((card, index) => (
          <Card
            key={card.id}
            id={card.id}
            slug={card.slug}
            n={card.n}
            title={card.title}
            description={card.description}
            index={index}
            totalCards={cardData.length}
            color={card.color}
            largura={card.largura}
            altura={card.altura}
          />
        ))}
      </section>
    </div>
  );
};
