import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { BotaoPreferenciasCookies } from "@/components/consentimento-cookies";
import styles from "./politica.module.css";

export const metadata: Metadata = { title: "Política de cookies | WordCom" };

export default function PoliticaDeCookies() {
  return <div className={styles.page}>
    <header className={styles.header}>
      <Link href="/" aria-label="WordCom: voltar ao site"><Image src="/marca/wordcom-logo.png" alt="WordCom" width={180} height={75} /></Link>
      <Link href="/"><ArrowLeft size={18} aria-hidden="true" />Voltar ao site</Link>
    </header>
    <main id="inicio" className={styles.content}>
      <h1>Política de cookies</h1>
      <p className={styles.updated}>Atualizada em 8 de outubro de 2026</p>
      <p>Esta página explica o armazenamento de preferências e o uso de tecnologias de análise e publicidade no novo site da WordCom Publicidade.</p>
      <h2>O que são cookies?</h2>
      <p>Cookies são pequenos arquivos que os sites podem armazenar no navegador. Outras tecnologias, como o armazenamento local, também podem guardar informações entre visitas.</p>
      <h2>O que está ativo neste site?</h2>
      <p>Atualmente, este novo site não carrega Google Tag Manager, Google Analytics nem Meta Pixel. Aceitar recursos opcionais não ativa essas ferramentas nesta versão. A eventual integração dependerá de configuração e testes de consentimento.</p>
      <h2>Sua preferência de privacidade</h2>
      <p>Usamos o armazenamento local do seu navegador, sob a chave <code>wordcom:consentimento:v1</code>, para lembrar sua escolha por até 180 dias. O registro contém a versão da preferência, a data da escolha e as categorias permitidas. Ele não contém nome, e-mail ou telefone e não é enviado a um servidor por este controle.</p>
      <p>Quando esse prazo expira, a preferência é inválida ou o armazenamento é apagado, o aviso volta a aparecer. Se o navegador bloquear o armazenamento, sua escolha pode ser solicitada novamente na próxima visita.</p>
      <h2>Categorias opcionais</h2>
      <p><strong>Análise:</strong> destinada à medição de visitas e navegação, como a realizada pelo Google Analytics, quando essa integração for ativada.</p>
      <p><strong>Publicidade:</strong> destinada à medição de campanhas e ações relacionadas a anúncios, como a realizada pelo Meta Pixel, quando essa integração for ativada.</p>
      <p>As categorias opcionais começam desmarcadas. Rejeitá-las não impede a navegação, o acesso aos documentos ou o contato com a empresa.</p>
      <h2>Como mudar sua escolha</h2>
      <p>Use o botão abaixo ou o acesso “Preferências de cookies” no rodapé. Você também pode apagar o armazenamento do site nas configurações do navegador.</p>
      <div className={styles.preferences}><BotaoPreferenciasCookies /></div>
      <h2>Links externos e infraestrutura</h2>
      <p>Ao abrir um link externo, como o WhatsApp, passam a valer as políticas do serviço acessado. A infraestrutura de hospedagem também pode tratar dados técnicos de acesso e segurança; o aviso não controla esses registros operacionais.</p>
      <h2>Dados do formulário de contato</h2>
      <p>A autorização para atendimento no formulário é separada das preferências de cookies. Rejeitar cookies opcionais não impede o envio quando o serviço de contato estiver disponível.</p>
      <h2>Dúvidas</h2>
      <p>Para falar com a WordCom sobre esta página, entre em contato pelo e-mail <a href="mailto:comercial@wordcom.com.br">comercial@wordcom.com.br</a>.</p>
    </main>
  </div>;
}
