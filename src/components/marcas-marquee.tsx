"use client";

import Image from "next/image";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee";

export type MarcaCliente = {
  nome: string;
  imagem: string;
  largura: number;
  altura: number;
};

export function MarcasMarquee({ marcas }: { marcas: MarcaCliente[] }) {

  return (
    <div className="clientsMarquee">
      <ul className="soLeitor" aria-label="Marcas que escolheram a WordCom">
        {marcas.map((marca) => <li key={marca.nome}>{marca.nome}</li>)}
      </ul>
      <Marquee aria-hidden="true">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent speed={36} pauseOnHover={false}>
          {marcas.map((marca) => (
            <MarqueeItem key={marca.nome} className="clientBrand">
              <Image
                src={marca.imagem}
                alt={marca.nome}
                width={marca.largura}
                height={marca.altura}
                sizes="(max-width: 600px) 112px, 144px"
                loading="eager"
              />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}
