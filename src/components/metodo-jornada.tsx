import Image from "next/image";
import { EntradaScroll } from "@/components/entrada-scroll";

export type Etapa = {
  etapa: string;
  titulo: string;
  texto: string;
  nota: string;
  imagem: string;
  largura: number;
  altura: number;
};

export function MetodoJornada({ etapas }: { etapas: Etapa[] }) {
  return (
    <ol className="metodoArtes" aria-label="Etapas do processo WordCom">
      {etapas.map((etapa, index) => (
        <li key={etapa.etapa} className="metodoArte" tabIndex={0}>
          <EntradaScroll delay={index * 0.06}>
            <div className="metodoDestaque">
              <Image
                src={etapa.imagem}
                alt={`${etapa.etapa}. ${etapa.titulo}. ${etapa.texto} ${etapa.nota}.`}
                width={etapa.largura}
                height={etapa.altura}
                sizes="(max-width: 600px) 90vw, (max-width: 1100px) 42vw, 22vw"
              />
            </div>
          </EntradaScroll>
        </li>
      ))}
    </ol>
  );
}
