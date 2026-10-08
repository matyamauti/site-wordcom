import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ConsentimentoCookies } from "@/components/consentimento-cookies";

/* A mesma Montserrat que o site já usa. Via next/font ela é self-hosted no
   build, com preload e font-display: swap — sem requisição a terceiro e sem
   texto invisível durante o carregamento.
   O nome da variável é o que o CSS do site espera: --font-wordcom. */
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-wordcom",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WordCom — A última PALAVRA em comunicação",
  description:
    "Publicidade, marketing, conteúdo, audiovisual e eventos em uma comunicação integrada.",
  icons: {
    icon: "/marca/favicon.svg",
    shortcut: "/marca/favicon.svg",
    apple: "/marca/favicon.svg",
  },
  openGraph: {
    title: "WordCom — A última PALAVRA em comunicação",
    description:
      "Publicidade, marketing, conteúdo, audiovisual e eventos em uma comunicação integrada.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* sem viewport-fit=cover, env(safe-area-inset-*) devolve 0px e o botão
     flutuante do WhatsApp fica sobre a barra de gestos do iPhone */
  viewportFit: "cover",
  /* o teclado do Android passa a encolher o viewport, como já faz no iOS */
  interactiveWidget: "resizes-content",
  /* a cor da barra do navegador acompanha o topo real da página (hero #212121) */
  themeColor: "#212121",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>
        {/* quem navega por teclado pulava o menu inteiro em cada carga */}
        <a href="#inicio" className="pularConteudo">
          Pular para o conteúdo
        </a>
        {children}
        <ConsentimentoCookies />
      </body>
    </html>
  );
}
