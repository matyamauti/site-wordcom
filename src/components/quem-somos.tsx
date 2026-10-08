import { FundoVideo } from "@/components/fundo-video";
import { FAQ, type FAQCategory } from "@/components/ui/faq-tabs";
import styles from "./quem-somos.module.css";

const categories: FAQCategory[] = [
  {
    id: "quem-somos",
    label: "Quem Somos",
    questions: [
      {
        question: "O que é a WordCom Publicidade?",
        answer: "A WordCom Publicidade é uma agência “full service” (agência 360º).",
      },
      {
        question: "O que isso significa?",
        answer: "Ela tem capacidade para gerenciar todos os tipos de estratégias e ações de Marketing e Publicidade dos seus clientes, realizando serviços nos variados tipos de mídia.",
      },
      {
        question: "Como a WordCom trabalha?",
        answer: "Nós planejamos, implementamos e mensuramos os resultados, de maneira integrada e ampla. Focamos em todos os aspectos que envolvem uma estratégia de Marketing.",
      },
      {
        question: "Como são formadas as equipes?",
        answer: "Possuímos equipes multidisciplinares que unificam as competências necessárias para tocar toda a Comunicação e o Marketing de um cliente.",
      },
      {
        question: "Quais serviços a WordCom realiza?",
        answer: "Desenvolvemos sites, automatizamos o Marketing Digital, promovemos eventos, criamos embalagens, executamos ações promocionais em pontos de venda e gerimos campanhas publicitárias em meios digitais e físicos.",
      },
    ],
  },
  {
    id: "somos-um-polvo",
    label: "Somos um Polvo",
    questions: [
      {
        question: "O que o mascote Jack representa?",
        answer: "O nosso mascote Jack traduz nossa capacidade de ser uma agência 360°!",
      },
      {
        question: "Quais características fazem parte dessa atuação?",
        answer: "Precisão, criatividade, rapidez, experiência e inteligência se associam à sensibilidade de perceber as tendências do mercado, oferecendo um atendimento completo para a Comunicação do seu negócio!",
      },
    ],
  },
];

export function QuemSomos() {
  return (
    <section
      className={`section ${styles.section}`}
      id="quem-somos"
      aria-labelledby="quem-somos-titulo"
    >
      <div className={styles.background} aria-hidden="true">
        <FundoVideo
          src="/midia/quem-somos-fundo.mp4"
          poster="/midia/quem-somos-poster.webp"
          className={styles.video}
        />
      </div>
      <div className={styles.content}>
        <h2 id="quem-somos-titulo">Sobre a <span className="tituloDestaque">Wordcom</span></h2>
        <div className={styles.layout}>
          <FAQ categories={categories} />
        </div>
      </div>
    </section>
  );
}
