import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, FileText } from "lucide-react";
import { FooterWordcom } from "@/components/footer-wordcom";

type PaginaInstitucionalProps = {
  titulo: string;
  outroDocumento: { titulo: string; href: string };
  documento: { href: string; nome: string; paginas: number };
};

export function PaginaInstitucional({ titulo, outroDocumento, documento }: PaginaInstitucionalProps) {
  return (
    <>
      <header className="institutionalHeader">
        <Link href="/" aria-label="WordCom: voltar ao site">
          <Image src="/marca/wordcom-logo.png" alt="WordCom" width={180} height={75} priority />
        </Link>
        <Link href="/" className="institutionalBack"><ArrowLeft size={18} aria-hidden="true" />Voltar ao site</Link>
      </header>
      <main id="inicio" className="institutionalMain" tabIndex={-1}>
        <div className="institutionalTitle">
          <h1>{titulo}</h1>
        </div>
        <div className="institutionalContent">
          <div className="institutionalDocument">
            <div className="institutionalDocumentBar">
              <p><FileText size={20} aria-hidden="true" />PDF, {documento.paginas} páginas</p>
              <div className="institutionalDocumentActions">
                <a href={documento.href} target="_blank" rel="noopener noreferrer">Abrir PDF<ArrowUpRight size={18} aria-hidden="true" /><span className="soLeitor"> em nova aba</span></a>
                <a href={documento.href} download={documento.nome}><Download size={18} aria-hidden="true" />Baixar PDF</a>
              </div>
            </div>
            <iframe className="institutionalPdf" src={documento.href} title={`${titulo}: documento em PDF`} loading="lazy" />
          </div>
          <nav className="institutionalRelated" aria-label="Documentos institucionais">
            <Link href={outroDocumento.href}><span>{outroDocumento.titulo}</span><ArrowUpRight size={20} aria-hidden="true" /></Link>
          </nav>
        </div>
      </main>
      <FooterWordcom
        homeHref="/"
        whatsapp="https://wa.me/5511974256616"
        solucoes={["Estratégia & Branding", "Digital & Performance", "Conteúdo & Audiovisual", "Eventos & Experiências", "Imprensa & Reputação", "Mídia ON & OFF"]}
      />
    </>
  );
}
