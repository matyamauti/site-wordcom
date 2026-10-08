# Consentimento de cookies - fase local

O controle e montado no layout global. Oferece aceite total, rejeicao e escolha
por categoria. Usa localStorage por 180 dias com versao e validacao estrita;
sem armazenamento disponivel, guarda somente na memoria da pagina. A escolha
e compartilhada entre abas pelo evento storage e pode ser revista pelo rodape.

Nao ha scripts do GTM, Analytics ou Meta instalados nesta fase, mesmo apos
aceite. Nenhuma alteracao foi feita no container GTM-NPMMSFKF, que pode atender
o site antigo. A politica descreve explicitamente esse estado.

## Antes de ativar o rastreamento

- Validar os textos e as finalidades com o responsavel de privacidade da empresa.
- Exportar/revisar o container publicado e seus acionadores, modelos e cookies.
- Separar o ambiente de teste das metricas reais e das conversoes de campanhas.
- Integrar o estado inicial negado e as atualizacoes com Consent Mode v2 usando
  APIs de consentimento do GTM ou uma CMP apropriada. O banner sozinho nao faz isso.
- Exigir consentimento de publicidade no Meta Pixel; nao assumir que ele respeita
  Consent Mode do Google. Revisar tambem Conversion Linker e as tags de servidor.
- Testar rejeicao, aceite parcial, aceite total, revogacao, expiracao, navegacao,
  pedidos de rede e cookies reais no Tag Assistant e DevTools antes de publicar.
- Atualizar a politica com fornecedores, finalidades, nomes e duracoes reais.
- Se houver exigencia de CMP certificada para o produto/regiao do Google, usar
  uma solucao que atenda esse requisito, em vez de apresentar este aviso como certificacao.

O evento lead_form_submit so entra no dataLayer com analise E publicidade
permitidas. Isso nao altera o envio de e-mail nem substitui controles nas tags.
Nao constitui certificacao ou garantia de conformidade integral com a LGPD.
