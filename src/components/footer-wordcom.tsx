import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, MessageCircle, ShieldCheck, FileCheck2 } from "lucide-react";
import { EntradaScroll } from "@/components/entrada-scroll";
import { BotaoPreferenciasCookies } from "@/components/consentimento-cookies";

type FooterWordcomProps = {
  whatsapp: string;
  solucoes: string[];
  homeHref?: string;
};

const navegacao = [
  { nome: "Nosso processo", href: "#metodologia" },
  { nome: "Experiência setorial", href: "#setores" },
  { nome: "Cases", href: "#cases" },
  { nome: "Nossas marcas", href: "#clientes" },
  { nome: "Projetos", href: "#projetos" },
  { nome: "Agenda", href: "#agenda" },
];

export function FooterWordcom({ whatsapp, solucoes, homeHref = "" }: FooterWordcomProps) {
  return (
    <footer className="wordcomFooter" id="rodape">
      <EntradaScroll destaque className="footerColumns">
        <div className="footerBrand">
          <a href={`${homeHref}#inicio`} aria-label="WordCom: voltar ao início">
            <Image src="/marca/wordcom-logo.png" alt="WordCom" width={240} height={99} />
          </a>
          <p className="footerSignature">A última PALAVRA em comunicação</p>
          <p className="footerDescription">
            Publicidade, marketing e comunicação integrada para conectar marcas, pessoas e resultados.
          </p>
        </div>

        <nav className="footerNavigation" aria-labelledby="footer-navegacao">
          <h2 id="footer-navegacao">Explore</h2>
          <ul>
            {navegacao.map((item) => <li key={item.href}><a href={`${homeHref}${item.href}`}>{item.nome}</a></li>)}
          </ul>
        </nav>

        <nav className="footerSolutions" aria-labelledby="footer-solucoes">
          <h2 id="footer-solucoes">Soluções</h2>
          <ul>
            {solucoes.map((solucao) => <li key={solucao}><a href={`${homeHref}#solucoes`}>{solucao}</a></li>)}
          </ul>
        </nav>

        <div className="footerContact">
          <h2>Vamos conversar</h2>
          <a className="footerWhatsapp" href={whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={20} aria-hidden="true" />
            <span>Fale com a WordCom</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="footerPhone" href={whatsapp} target="_blank" rel="noreferrer">+55 (11) 97425-6616</a>
          <a className="footerBrief" href={`${homeHref}#contato`}>Conte sobre seu projeto <ArrowUpRight size={16} aria-hidden="true" /></a>
          <nav className="footerDocuments" aria-label="Ética e compliance">
            <Link href="/documentos-institucionais"><ShieldCheck size={20} aria-hidden="true" /><span>Código e Ética</span></Link>
            <Link href="/documentos-institucionais"><FileCheck2 size={20} aria-hidden="true" /><span>Procedimentos de Compliance</span></Link>
          </nav>
          <div className="footerLocations">
            <h3>Onde estamos</h3>
            <ul><li>São Paulo</li><li>Santos</li><li>Campinas</li></ul>
          </div>
        </div>
      </EntradaScroll>

      <div className="footerBottom">
        <small>© 2026 WordCom Publicidade. Todos os direitos reservados.</small>
        <Link href="/politica-de-cookies">Política de cookies</Link>
        <BotaoPreferenciasCookies />
        <a className="footerBackTop" href="#inicio">Voltar ao topo <ArrowUp size={18} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
