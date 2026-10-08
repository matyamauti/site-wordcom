# E-mail do formulario de contato

O formulario envia `POST /api/lead`. O servidor valida os campos e usa o SMTP
do Google Workspace por TLS (smtp.gmail.com, porta 465). Nao usa Resend,
`mailto:` nem o antigo webhook. O destinatario e fixo: comercial@wordcom.com.br.
O Reply-To e o e-mail do visitante; o remetente e a conta autenticada do Google.

## Configuracao local

Em `.env.local`, preencher:

```dotenv
GOOGLE_SMTP_USER=matheus.yamauti@wordcom.com.br
GOOGLE_SMTP_APP_PASSWORD=
```

Preencher a segunda variavel somente no arquivo privado. Nao colocar a senha
em mensagens, prints, comandos de terminal ou variaveis `NEXT_PUBLIC_*`.
Nunca usar a senha normal da conta. Usar a senha de app autorizada pelo Google.
O codigo remove os espacos de agrupamento da senha de app.

## Vercel

O envio fica bloqueado na Vercel enquanto `CONTACT_EMAIL_ENABLED` nao for `true`.
Isso permite publicar o visual sem ativar o envio em teste. Manter `false` nesta
publicacao e so ativar depois da validacao de recebimento com o comercial.

Cadastrar as mesmas duas variaveis em Project Settings > Environment Variables
no ambiente Production e marcar o segredo como Sensitive. So cadastrar em
Preview se houver necessidade de envio real naquele ambiente.
Depois fazer um novo deploy. `.env.local` nao e enviado para a Vercel.

## Teste real

Preencher todos os campos no localhost e autorizar o contato. Enviar uma mensagem
identificada como teste. Confirmar o recebimento na caixa comercial, inclusive
Spam, e conferir o Reply-To usando Responder. O site so informa sucesso apos o
SMTP aceitar o destinatario; isso nao garante colocacao na caixa de entrada.
Nao publicar como funcional antes deste teste e de repetir o teste na producao.

## Protecoes

Validacao de tipos, tamanhos, consentimento e cabecalhos; HTML escapado;
destinatario fixo; honeypot; bloqueio de origens diferentes quando Origin esta
presente; corpo limitado a 16 KiB; timeouts SMTP; ausencia de dados pessoais
nos logs. Ha um freio local de tres tentativas por e-mail em dez minutos,
limitado a cada instancia do servidor. Nao e uma protecao distribuida:
configurar rate limiting de `/api/lead` no firewall da Vercel antes da divulgacao
publica, ou integrar captcha/armazenamento compartilhado se houver abuso.

Se a senha de app for revogada, trocar a configuracao privada e fazer novo deploy.
O Google pode bloquear autenticacoes novas por seguranca; verificar a conta e
as politicas do administrador, sem desativar as protecoes da conta.
