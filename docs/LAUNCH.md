# Preparação para publicação

## Estado atual

- Código e histórico disponíveis em https://github.com/lbacelardev/lucas-bacelar-saude.
- CI aprovada: lint, testes, TypeScript, build, formatação e testes de navegador.
- Lucas conferiu navegação e formulário em desktop e mobile.
- Site comercial ainda não publicado. Hospedagem e endereço público aguardam definição.

## Hospedagem

O GitHub permanece como repositório do portfólio. Não usar GitHub Pages como hospedagem desta versão de captação comercial: os [termos do serviço](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features) restringem o uso para operação de negócios e facilitação de transações comerciais.

O workflow manual de Pages existente não foi executado e não deve ser usado para o lançamento comercial. Uma demonstração exclusivamente educacional exigiria escopo e conteúdo próprios.

O projeto gera arquivos estáticos e pode ser hospedado por um provedor compatível, sem servidor Node em produção. Para uma integração com Git:

| Campo                                | Valor                             |
| ------------------------------------ | --------------------------------- |
| Repositório                          | `lbacelardev/lucas-bacelar-saude` |
| Branch                               | `main`                            |
| Diretório raiz                       | raiz do repositório               |
| Node.js                              | 24                                |
| Instalação, se houver campo separado | `npm ci`                          |
| Build                                | `npm run build`                   |
| Diretório publicado                  | `dist`                            |

Cloudflare Pages, por exemplo, documenta `npm run build` e `dist` para [React com Vite](https://developers.cloudflare.com/pages/configuration/build-configuration/). A escolha do provedor, conta, plano e domínio deve ser confirmada antes da ativação; não foram criadas contas ou contratados serviços.

## Antes de divulgar

1. Confirmar com Lucas as operadoras e os produtos efetivamente comercializados.
2. Definir os procedimentos reais de retenção e exclusão dos dados recebidos no atendimento. Atualizar o aviso de privacidade com esses procedimentos e a hospedagem escolhida, sem inventar prazos.
3. Definir uma URL principal. Depois disso, configurar canonical, URL de compartilhamento, imagem social e sitemap com endereços reais.
4. Publicar o build aprovado e verificar HTTPS, carregamento de assets e navegação na URL final.
5. Conferir o número e o texto do pedido no WhatsApp, sem enviar mensagens de teste automaticamente.
6. Testar localização opcional no endereço HTTPS e a alternativa de preenchimento manual.

## Depois do lançamento

Atualizar o README com o endereço público. Medição de acessos e relatório diário às 22h estão implementados, aguardando configuração e teste real conforme [REPORTING.md](REPORTING.md). A publicação por si só não ativa métricas nem e-mails.
