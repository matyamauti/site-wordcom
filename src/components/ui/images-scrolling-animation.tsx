"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const projects = [
  { title: "ENIP", slug: "enip", image: "11_55_09" },
  { title: "Jornal Portuário", slug: "jornal-portuario", image: "11_58_29" },
  { title: "Empreenda Sim", slug: "empreenda-sim", image: "12_02_03" },
];

type StickyCardProps = {
  i: number;
  title: string;
  slug: string;
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  reducedMotion: boolean;
};

export function StickyCard_001({
  i, title, slug, src, progress, range, targetScale, reducedMotion,
}: StickyCardProps) {
  const transform = useTransform(progress, range, ["scale(1)", `scale(${targetScale})`]);

  return (
    <div className="projectScrollSlot" style={{ top: reducedMotion ? 0 : `${110 + i * 20}px` }}>
      <motion.div
        className="projectScrollCard"
        style={{
          transform: reducedMotion ? "none" : transform,
        }}
      >
        <Link href={`/projetos/${slug}`} aria-label={`Conhecer o projeto ${title}`}>
          <Image
            src={src}
            alt={`Projeto ${i + 1}: ${title}`}
            width={2172}
            height={724}
            sizes="(min-width: 1334px) 1120px, (max-width: 600px) 94vw, 84vw"
          />
        </Link>
      </motion.div>
    </div>
  );
}

export function ImagesScrollingAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 35%", "end 35%"],
  });

  // Native page scroll keeps this effect local; no root smooth-scroll provider.
  return (
    <div ref={container} className="projectsScrollStack">
      {projects.map((project, i) => (
        <StickyCard_001
          key={project.slug}
          i={i}
          title={project.title}
          slug={project.slug}
          src={`/Cards-projetos/Imagem do ChatGPT 7 de out. de 2026, ${project.image}.png`}
          progress={scrollYProgress}
          range={[i * 0.2, 1]}
          targetScale={Math.max(0.6, 1 - (projects.length - i - 1) * 0.08)}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
