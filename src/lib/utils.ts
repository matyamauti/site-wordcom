/* Dados das cartas da pilha de projetos.

   O componente glass-cards importa `cardData` de ../../lib/utils — este
   arquivo existe para atender esse import, que é como o componente veio.

   `color` precisa conter a string "0.8": o componente deriva os outros dois
   pontos do gradiente com color.replace('0.8', '0.6') e ('0.8', '0.4'). */

export type CardItem = {
  id: number;
  slug: string;
  n: string;
  title: string;
  description: string;
  color: string;
  /* medidas reais da arte, para o navegador reservar o espaço certo */
  largura: number;
  altura: number;
};

export const cardData: CardItem[] = [
  {
    id: 1,
    slug: "enip",
    n: "01",
    title: "ENIP",
    description: "Indústria, logística e infraestrutura em um encontro nacional.",
    color: "rgba(168, 85, 247, 0.8)",
    largura: 1600,
    altura: 167,
  },
  {
    id: 2,
    slug: "jornal-portuario",
    n: "02",
    title: "Jornal Portuário",
    description: "Conteúdo e mídia para quem movimenta o Brasil.",
    color: "rgba(224, 71, 154, 0.8)",
    largura: 1600,
    altura: 230,
  },
  {
    id: 3,
    slug: "empreenda-sim",
    n: "03",
    title: "Empreenda Sim",
    description: "Eventos, conhecimento e comunidade para empreendedores.",
    /* verde: identidade própria do Empreenda Sim, não da paleta WordCom */
    color: "rgba(34, 199, 106, 0.8)",
    largura: 1600,
    altura: 331,
  },
];
