import Image from "next/image";
import { CasesCoverflow } from "@/components/cases-coverflow";
import { FormularioContato } from "@/components/formulario-contato";
import { FundoOndas } from "@/components/fundo-ondas";
import { FundoVideo } from "@/components/fundo-video";
import { MenuMobile } from "@/components/menu-mobile";
import { HeroSequencia } from "@/components/hero-sequencia";
import { MetodoJornada } from "@/components/metodo-jornada";
import { MarcasMarquee } from "@/components/marcas-marquee";
import { FooterWordcom } from "@/components/footer-wordcom";
import { EntradaScroll } from "@/components/entrada-scroll";
import { ImagesScrollingAnimation } from "@/components/ui/images-scrolling-animation";
import FAQs from "@/components/ui/text-reveal-faqs";
import { SolucoesAnel } from "@/components/solucoes-anel";
import { QuemSomos } from "@/components/quem-somos";

/* Porte fiel do site atual para Next.js.
   O design não muda: as classes e a estrutura são as mesmas, e o CSS é o
   original importado sem edição. O que mudou está sempre comentado e cai em
   uma destas três categorias:
     (a) acessibilidade sem efeito visual
     (b) semântica de HTML sem efeito visual
     (c) comportamento que o site já tinha e aqui é reimplementado

   Mudança estrutural (b): <header> e <footer> saíram de dentro de <main>.
   Um <main> que engloba o cabeçalho e o rodapé desorienta leitor de tela e
   navegação por regiões. Verifiquei antes: nenhuma regra do CSS depende de
   `main`, então não há diferença visual. */

const WHATSAPP =
  "https://wa.me/5511974256616?text=Ol%C3%A1%21%20Conheci%20a%20WordCom%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto%20de%20comunica%C3%A7%C3%A3o%20para%20a%20minha%20empresa.";

const servicos = [
  {
    n: "01",
    titulo: "Estratégia & Branding",
    texto:
      "Posicionamento, identidade, campanhas e planejamento de comunicação.",
  },
  {
    n: "02",
    titulo: "Digital & Performance",
    texto: "Mídia, social, conteúdo, sites, dados e otimização contínua.",
  },
  {
    n: "03",
    titulo: "Conteúdo & Audiovisual",
    texto: "Filmes, programas, podcasts, fotografia e narrativas de marca.",
  },
  {
    n: "04",
    titulo: "Eventos & Experiências",
    texto: "Concepção, produção, conteúdo, divulgação e execução completa.",
  },
  {
    n: "05",
    titulo: "Imprensa & Reputação",
    texto: "Relacionamento com a mídia, autoridade e presença institucional.",
  },
  {
    n: "06",
    titulo: "Mídia ON & OFF",
    texto: "TV, rádio, OOH, mídia programática e plataformas digitais.",
  },
];

const metodo = [
  {
    etapa: "01 · IMERSÃO",
    titulo: "Entendemos o cenário",
    texto:
      "Conhecemos a empresa, o público, o mercado, o momento e os objetivos.",
    nota: "Diagnóstico e pesquisa",
    imagem: "/Cards-Resultados/Imagem do ChatGPT 7 de out. de 2026, 09_46_11.png",
    largura: 1159,
    altura: 1356,
  },
  {
    etapa: "02 · DIREÇÃO",
    titulo: "Definimos o caminho",
    texto:
      "Organizamos objetivos, mensagens, canais, investimentos e indicadores.",
    nota: "Plano de comunicação integrado",
    imagem: "/Cards-Resultados/Imagem do ChatGPT 7 de out. de 2026, 09_58_49.png",
    largura: 1122,
    altura: 1402,
  },
  {
    etapa: "03 · EXECUÇÃO",
    titulo: "Colocamos a estratégia em ação",
    texto:
      "Produzimos conteúdos, campanhas, ativações e experiências de marca.",
    nota: "Produção e campanhas",
    imagem: "/Cards-Resultados/Imagem do ChatGPT 7 de out. de 2026, 10_10_04.png",
    largura: 1122,
    altura: 1402,
  },
  {
    etapa: "04 · EVOLUÇÃO",
    titulo: "Medimos e aprimoramos",
    texto:
      "Acompanhamos indicadores, identificamos aprendizados e ajustamos as ações.",
    nota: "Otimização contínua",
    imagem: "/Cards-Resultados/Imagem do ChatGPT 7 de out. de 2026, 10_14_17.png",
    largura: 1122,
    altura: 1402,
  },
];

const setores = [
  {
    nome: "Logística & comércio exterior",
    pergunta: "Como conectar marcas de logística e comércio exterior aos públicos certos?",
    texto:
      "Conectamos conteúdo especializado, assessoria de imprensa e eventos para aproximar empresas de clientes, parceiros e lideranças do setor. Projetos como o ENIP e o Jornal Portuário fazem parte dessa atuação, com pautas ligadas a portos, indústria e infraestrutura.",
  },
  {
    nome: "Indústria & farmacêutico",
    pergunta: "Como comunicar soluções da indústria e do setor farmacêutico com clareza?",
    texto:
      "Traduzimos informações técnicas em mensagens que cada público entende, com branding, conteúdo institucional, audiovisual e relacionamento com a imprensa. A comunicação é construída em conjunto com as equipes responsáveis pelas informações, preservando a precisão e o contexto de cada produto ou solução.",
  },
  {
    nome: "Mercado imobiliário",
    pergunta: "Como transformar o interesse por um imóvel em oportunidades comerciais?",
    texto:
      "Integramos posicionamento, campanhas, mídia digital e materiais de venda para apresentar os diferenciais de cada empreendimento. Do lançamento à entrega, o conteúdo orienta o comprador e apoia o trabalho comercial, com ações ajustadas ao perfil do público e ao momento do projeto.",
  },
  {
    nome: "Educação",
    pergunta: "Como atrair alunos e fortalecer a marca de uma instituição de ensino?",
    texto:
      "Planejamos campanhas de captação e conteúdos que apresentam a proposta pedagógica, os cursos e a experiência de estudar na instituição. A estratégia considera o calendário de matrículas e as dúvidas de estudantes e famílias, conectando presença digital, reputação e relacionamento.",
  },
  {
    nome: "Hotelaria",
    pergunta: "Como valorizar a experiência de um hotel e estimular reservas?",
    texto:
      "Usamos fotografia, audiovisual, conteúdo e mídia para apresentar acomodações, serviços e experiências antes da chegada do hóspede. As campanhas acompanham a sazonalidade e o perfil de quem viaja, destacando os diferenciais da marca e aproximando o interesse da decisão de reserva.",
  },
  {
    nome: "Varejo, e-commerce & vendas digitais",
    pergunta: "Como integrar marca e performance no varejo e no e-commerce?",
    texto:
      "Conectamos campanhas, conteúdo e mídia à jornada de compra, mantendo uma comunicação consistente da descoberta do produto à venda. Acompanhamos os indicadores definidos para cada ação e ajustamos criativos, canais e investimentos para apoiar os objetivos comerciais da operação.",
  },
];

const clientes = [
  { nome: "Piacentini do Brasil", arquivo: "12_58_21", largura: 1774, altura: 887 },
  { nome: "Record TV Litoral e Vale", arquivo: "12_59_21", largura: 1363, altura: 1154 },
  { nome: "T-Grão Cargo", arquivo: "12_59_31", largura: 1632, altura: 964 },
  { nome: "Viston", arquivo: "12_59_39", largura: 1660, altura: 948 },
  { nome: "Wordcom Brasil", arquivo: "12_59_52", largura: 1559, altura: 1009 },
  { nome: "Politicar Podcast", arquivo: "13_00_01", largura: 1584, altura: 993 },
  { nome: "Mattei Franco Advocacia Ambiental", arquivo: "13_00_12", largura: 1893, altura: 831 },
  { nome: "Mitsui Chemicals", arquivo: "13_00_25", largura: 1426, altura: 1103 },
  { nome: "Vidromar", arquivo: "13_00_35", largura: 1305, altura: 1205 },
  { nome: "Unoeste", arquivo: "13_00_51", largura: 1782, altura: 883 },
  { nome: "ArenaTech", arquivo: "13_01_00", largura: 1744, altura: 902 },
  { nome: "Staging em Ação", arquivo: "13_01_29", largura: 1656, altura: 950 },
  { nome: "Porto & Baixada", arquivo: "13_01_45", largura: 1536, altura: 1024 },
  { nome: "JP", arquivo: "13_01_59", largura: 1587, altura: 991 },
  { nome: "Fórum Brasileiro de Turismo Histórico-Cultural", arquivo: "13_02_10", largura: 1653, altura: 952 },
  { nome: "Empresas & Mercado", arquivo: "13_02_24", largura: 1630, altura: 965 },
  { nome: "Coruja Consultoria", arquivo: "13_02_32", largura: 1711, altura: 919 },
  { nome: "Contra o Tempo", arquivo: "13_02_40", largura: 1717, altura: 916 },
  { nome: "Complexo Empresarial Andaraguá", arquivo: "13_02_51", largura: 1443, altura: 1090 },
  { nome: "André Ursini", arquivo: "13_03_01", largura: 1594, altura: 986 },
  { nome: "Se7e", arquivo: "13_03_09", largura: 1820, altura: 864 },
  { nome: "Torneio Beach Tennis Wordcom Praia Grande", arquivo: "13_03_19", largura: 1455, altura: 1081 },
  { nome: "Donna G Beach Bar", arquivo: "13_03_28", largura: 1556, altura: 1011 },
  { nome: "Encontro Regional Indústria Porto 2024", arquivo: "13_03_37", largura: 1377, altura: 1142 },
  { nome: "Liceu São Paulo", arquivo: "13_03_49", largura: 1254, altura: 1254 },
  { nome: "Logline", arquivo: "13_03_58", largura: 2043, altura: 770 },
];

const projetos = [
  {
    n: "01",
    slug: "enip",
    nome: "ENIP",
    texto: "Indústria, logística e infraestrutura em um encontro nacional.",
    largura: 1600,
    altura: 167,
  },
  {
    n: "02",
    slug: "jornal-portuario",
    nome: "Jornal Portuário",
    texto: "Conteúdo e mídia para quem movimenta o Brasil.",
    largura: 1600,
    altura: 230,
  },
  {
    n: "03",
    slug: "empreenda-sim",
    nome: "Empreenda Sim",
    texto: "Eventos, conhecimento e comunidade para empreendedores.",
    largura: 1600,
    altura: 331,
  },
];

const eventos = [
  {
    iso: "2026-09-01",
    dia: "01",
    mes: "SET 2026",
    local: "Campinas · Viracopos",
    nome: "Encontro Nacional Indústria Porto",
  },
  {
    iso: "2026-11-19",
    dia: "19",
    mes: "NOV 2026",
    local: "São Paulo",
    nome: "Encontro Nacional Indústria Porto",
  },
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <a href="#inicio">
          <Image
            src="/marca/wordcom-logo.png"
            alt="WordCom"
            width={135}
            height={56}
            priority
          />
        </a>
        <nav aria-label="Navegação principal">
          <a href="#quem-somos">Quem Somos</a>
          <a href="#solucoes">Soluções</a>
          <a href="#metodologia">Como atuamos</a>
          <a href="#cases">Cases</a>
          <a href="#projetos">Projetos</a>
        </nav>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="btn small"
          aria-label="Falar com a WordCom pelo WhatsApp"
        >
          WhatsApp ↗
        </a>
        <MenuMobile
          itens={[
            { href: "#quem-somos", texto: "Quem Somos" },
            { href: "#solucoes", texto: "Soluções" },
            { href: "#metodologia", texto: "Como atuamos" },
            { href: "#cases", texto: "Cases" },
            { href: "#projetos", texto: "Projetos" },
            { href: "#agenda", texto: "Agenda" },
            { href: "#contato", texto: "Contato" },
          ]}
          whatsapp={WHATSAPP}
        />
      </header>

      <main>
        {/* A hero é o filme da marca controlado pela rolagem. As frases, os
            quadros e o motor vivem no componente; aqui só o ponto de entrada.
            Os botões que existiam nesta dobra saíram por decisão do dono — o
            botão flutuante do WhatsApp, mais abaixo, segue cobrindo a ação. */}
        <HeroSequencia />

        <section className="numbers">
          <EntradaScroll destaque>
            <b>+150</b>
            <span>marcas atendidas</span>
          </EntradaScroll>
          <EntradaScroll destaque delay={0.06}>
            <b>360º</b>
            <span>comunicação integrada</span>
          </EntradaScroll>
          <EntradaScroll destaque delay={0.12}>
            <b>+60M</b>
            <span>visualizações por mês em projetos e canais WordCom</span>
          </EntradaScroll>
          <EntradaScroll destaque delay={0.18}>
            <b>ON + OFF</b>
            <span>em uma única direção</span>
          </EntradaScroll>
        </section>

        <QuemSomos />

        <section className="section light" id="solucoes">
          <FundoOndas />
          {/* Título sozinho: saíram o kicker, a primeira linha e o parágrafo de
              apoio. O h2 carrega a seção. */}
          <EntradaScroll destaque className="heading headingSo">
            <h2>Uma única <span className="tituloDestaque">direção</span></h2>
          </EntradaScroll>
          <EntradaScroll destaque className="scrollContent" delay={0.1}>
            <SolucoesAnel servicos={servicos} />
          </EntradaScroll>
        </section>

        <section className="section method" id="metodologia">
          {/* O rótulo acima do título e o gradiente numa palavra do título são
              os dois padrões que o CLAUDE.md deste projeto proíbe por nome.
              Entram aqui por decisão explícita do dono, registrada: ele quer a
              seção igual à referência que mandou. */}
          <EntradaScroll className="heading headingJornada">
            <div>
              <p className="jornadaRotulo">Nosso processo</p>
              <h2>
                Do desafio ao <strong className="tituloDestaque">Resultado</strong>
              </h2>
            </div>
            <p className="jornadaApoio">
              Estratégia, criatividade e execução conectadas para transformar
              desafios em evolução contínua.
            </p>
          </EntradaScroll>
          {/* as quatro etapas são sequência real: por isso a numeração fica */}
          <MetodoJornada etapas={metodo} />
        </section>

        <section className="section light sectors" id="setores" aria-labelledby="setores-titulo">
          <div className="setoresFundo" aria-hidden="true">
            <Image
              src="/midia/experiencia-setorial.png"
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <EntradaScroll destaque as="h2" className="setoresTitulo" id="setores-titulo">
            Experiência <span className="tituloDestaque">Setorial</span>
          </EntradaScroll>
          <EntradaScroll destaque className="setoresFaqLayout" delay={0.1}>
            <div className="setoresFaqIntro">
              <p>
                Cada mercado tem sua linguagem, seu público e seus desafios.
                Conectamos esse contexto à estratégia de comunicação da sua marca.
              </p>
              <p className="setoresFaqContact">
                <a href="#contato">Converse com a WordCom.</a>
              </p>
            </div>
            <FAQs setores={setores} />
          </EntradaScroll>
        </section>

        <section className="section dark" id="cases">
          <FundoVideo
            src="/midia/cases-fundo.mp4"
            poster="/midia/cases-poster.webp"
            className="casesVideo"
          />
          <EntradaScroll destaque className="heading">
            <div>
              <p className="kicker">Experiência aplicada</p>
              <h2>
                Cases que mostram
                <br />
                {" "}
                <em className="tituloDestaque">como entregamos</em>
              </h2>
            </div>
            <p>
              Cada case apresenta o desafio, as frentes acionadas, a execução e
              os resultados.
            </p>
          </EntradaScroll>
          <EntradaScroll destaque className="scrollContent" delay={0.1}>
            <CasesCoverflow />
          </EntradaScroll>
        </section>

        <section className="section light clients" id="clientes">
          <EntradaScroll destaque className="heading">
            <div>
              <p className="kicker">Confiança construída</p>
              <h2>
                Marcas que já escolheram a <em className="tituloDestaque">WordCom</em>
              </h2>
            </div>
          </EntradaScroll>
          <EntradaScroll destaque className="scrollContent" delay={0.1}>
            <MarcasMarquee marcas={clientes.map(({ arquivo, ...marca }) => ({
              ...marca,
              imagem: `/confiança/Imagem do ChatGPT 7 de out. de 2026, ${arquivo}.png`,
            }))} />
          </EntradaScroll>
        </section>

        <section className="section about">
          <FundoVideo />
          <EntradaScroll destaque>
            <p className="kicker">Estrutura WordCom</p>
            <h2>
              Ideias ganham força quando existe <em className="tituloDestaque">capacidade de execução</em>
            </h2>
          </EntradaScroll>
          <EntradaScroll destaque delay={0.12}>
            <p>
              Somos uma agência 360º com núcleos de publicidade, marketing
              digital, conteúdo, produção audiovisual e eventos. Essa estrutura
              permite conduzir projetos integrados sem fragmentar a comunicação
              entre diferentes fornecedores.
            </p>
            <p>
              Com escritórios em São Paulo, Santos e Campinas, reunimos
              atendimento, criação, redação, mídia, tráfego, tecnologia, foto,
              vídeo e produção.
            </p>
            <a className="under" href="#contato" aria-label="Conheça a WordCom">
              Conheça a WordCom ↗
            </a>
          </EntradaScroll>
        </section>

        <section className="section projects" id="projetos">
          {/* Mesma decisão já registrada na Metodologia: rótulo acima do
              título e gradiente numa parte do título são proibidos por nome no
              CLAUDE.md deste projeto, e entram por escolha explícita do dono —
              ele quer a seção igual à referência que mandou. */}
          <EntradaScroll destaque className="heading headingProjetos">
            <div>
              <p className="projetoRotulo">Projetos desenvolvidos pela WordCom</p>
              <h2>
                Também criamos
                <br />
                {" "}
                <strong className="tituloDestaque">nossas próprias plataformas</strong>
              </h2>
            </div>
          </EntradaScroll>
          <ImagesScrollingAnimation />
        </section>

        <section className="section light agenda" id="agenda">
          <EntradaScroll destaque>
            <p className="kicker">Próximos encontros</p>
            <h2>
              Acompanhe nosso
              <br />
              {" "}
              <em className="tituloDestaque">calendário de eventos</em>
            </h2>
            <p>
              Experiências que colocam pessoas, empresas e temas relevantes no
              mesmo ambiente.
            </p>
            <a
              href="#contato"
              className="under darkUnder"
              aria-label="Receba novidades da agenda"
            >
              Receba novidades da agenda ↗
            </a>
          </EntradaScroll>
          <div className="events">
            {eventos.map((e, index) => (
              <EntradaScroll destaque as="article" key={e.iso + e.local} delay={index * 0.06}>
                {/* (b) datetime legível por máquina: buscadores e leitores
                    passam a entender a data. Sem efeito visual. */}
                <time dateTime={e.iso}>
                  <b>{e.dia}</b>
                  <span>{e.mes}</span>
                </time>
                <div>
                  <p>{e.local}</p>
                  <h3>{e.nome}</h3>
                </div>
                <a
                  href="/projetos/enip"
                  aria-label={`Ver o ${e.nome} de ${e.mes}`}
                >
                  ↗
                </a>
              </EntradaScroll>
            ))}
          </div>
        </section>

        <section className="contact" id="contato">
          <div className="glow contactGlow" aria-hidden />
          <p className="kicker">Próximo projeto</p>
          <EntradaScroll destaque as="h2">
            Qual será a próxima
            <br />
            {" "}
            <em className="tituloDestaque">palavra da sua marca?</em>
          </EntradaScroll>
          <EntradaScroll destaque as="p" delay={0.08}>
            Conte o que sua empresa precisa comunicar. Nosso time entra em
            contato para entender o desafio e construir o próximo movimento.
          </EntradaScroll>
          <EntradaScroll destaque className="scrollContent" delay={0.12}>
            <FormularioContato />
          </EntradaScroll>
        </section>
      </main>

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        className="whatsappFloat"
        aria-label="Falar com a WordCom pelo WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.273.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 7.021 2.91 9.825 9.825 0 0 1 2.9 7.024c-.002 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>

      <FooterWordcom whatsapp={WHATSAPP} solucoes={servicos.map((servico) => servico.titulo)} />
    </>
  );
}
