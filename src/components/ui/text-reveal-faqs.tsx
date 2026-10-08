"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type SetorFAQ = {
  nome: string;
  pergunta: string;
  texto: string;
};

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BlurredStagger({ text }: { text: string }) {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  if (reduceMotion) return <p className="faqAnswer">{text}</p>;

  return (
    <p className="faqAnswer">
      <span className="soLeitor">{text}</span>
      {/* Palavras inteiras preservam as quebras e evitam centenas de camadas. */}
      <motion.span
        aria-hidden="true"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.015 } },
        }}
      >
        {text.split(" ").map((word, index, words) => (
          <span key={index}>
            <motion.span
              className="faqWord"
              variants={{
                hidden: { opacity: 0, filter: "blur(10px)" },
                show: { opacity: 1, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.3 }}
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </p>
  );
}

export default function FAQs({ setores }: { setores: SetorFAQ[] }) {
  return (
    <Accordion className="setoresFaq" type="single" collapsible>
      {setores.map((setor) => (
        <AccordionItem key={setor.nome} value={setor.nome}>
          <AccordionTrigger>
            <span className="faqQuestionGroup">
              <span className="faqSector">{setor.nome}</span>
              <span className="faqQuestion">{setor.pergunta}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <BlurredStagger text={setor.texto} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
