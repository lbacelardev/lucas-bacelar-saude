# Lucas Bacelar Saúde — especificação para Figma

**Estado:** arquivo editável criado em 30/10/2026: [abrir no Figma](https://www.figma.com/design/hb0o2ih43Zgz86VZU5mgvN).

O limite de três páginas do plano Starter levou à organização dos tópicos abaixo em:

1. **Contexto, fundamentos e case:** apresentação, paleta, tipografia, autoria e decisões técnicas.
2. **Componentes e estados:** botões, campos, cards, FAQ, formulários de família/empresa, erros, resumo e regras de localização.
3. **Desktop, mobile e fluxos:** telas editáveis de 1440, 390, 360 e 320 px, com navegação demonstrativa para formulário, revisão e contato.

Foram criadas 20 variáveis de cor (primitivas e aliases semânticos), seis estilos tipográficos e componentes com instâncias nas telas. Não foi usada uma imagem achatada da página como entrega.

**Fidelidade:** reconstrução a partir do código, não captura pixel a pixel. Segoe UI e Georgia não estavam disponíveis na conexão; Noto Sans e Libre Baskerville foram usadas apenas no Figma, com diferenças de métricas e quebra de linha. As fontes do site não foram alteradas.

**Validação e pendências:** telas desktop e mobile passaram por revisão visual inicial e correções de altura automática. Foram ajustados depois o redimensionamento dos componentes e a marca mobile. O limite de chamadas do Figma Starter interrompeu a conferência visual final desses ajustes e das pranchas de documentação/componentes. A navegação empresarial ainda termina no resumo demonstrativo de família: separar esse resumo antes de apresentar esse caminho como protótipo final. Os dados de exemplo são fictícios; o protótipo não coleta dados, não consulta localização e não envia mensagens.

Os tópicos seguintes preservam a especificação de referência; os oito tópicos estão agrupados nas três páginas, e itens de estados/interações descritos não equivalem necessariamente a interações funcionais do protótipo.

## 00 — Capa e contexto

Título: **Lucas Bacelar Saúde**. Subtítulo: **Landing page de consultoria de planos de saúde · Atendimento nacional**.

Objetivo: apresentar o consultor e direcionar o interessado ao WhatsApp. O formulário reúne as informações do primeiro contato; não calcula preços nem consulta uma API de cotação.

Identificar este arquivo como documentação produzida a partir de um produto já implementado. Não apresentar os desenhos como uma etapa de descoberta anterior ao código.

Autoria: projeto desenvolvido com uso de inteligência artificial (ChatGPT/Codex), sob orientação e acompanhamento de Lucas Bacelar. Lucas definiu os requisitos e a direção do produto, auditou as entregas e realizou revisões e refatorações conforme necessário.

## 01 — Fundamentos visuais

Criar estilos/variáveis com os nomes correspondentes aos tokens em `src/styles/global.css`:

| Token     | Valor   | Uso                                            |
| --------- | ------- | ---------------------------------------------- |
| navy      | #06274B | Fundo principal e texto em superfícies claras  |
| deep      | #041D39 | Fundo de cotação, faixa de operadoras e rodapé |
| surface   | #0D3358 | Cards e superfícies secundárias                |
| cream     | #FFF3DE | Texto claro e seção de processo                |
| paper     | #FFFBF4 | Formulário                                     |
| gold      | #E1B96C | CTA e destaques                                |
| gold-ink  | #79591C | Dourado legível sobre fundos claros            |
| muted     | #BDCBD6 | Texto secundário sobre azul                    |
| ink-muted | #526477 | Texto secundário sobre claro                   |
| error     | #A32A29 | Mensagens e bordas de erro                     |

Tipografia: Segoe UI, com Arial/sans-serif como alternativas de implementação. Georgia em destaques editoriais. Se a fonte não estiver disponível na conta do Figma, documentar a substituição; não alterar silenciosamente a referência.

Títulos: H1 fluido por viewport; H2 entre 32 e 44 px; formulário 30 px. Campos de entrada com 16 px. Texto de corpo entre 14 e 16 px. Reproduzir os tamanhos efetivos de cada frame a partir dos CSS, sem transformar todos os textos em uma escala única inventada.

Componentes com raios predominantes de 5, 6, 8 e 12 px. Controles de ícone com 44 × 44 px; campos com altura mínima de 48 px; botão principal com altura mínima de 52 px. Ícones Lucide, preservando os utilizados na aplicação.

## 02 — Biblioteca de componentes

Usar componentes, instâncias, propriedades de texto e Auto Layout onde aplicável:

- `Brand`: monograma lb com ponto dourado, nome e assinatura.
- `Button`: gold, dark e outline; estados padrão, hover, focus e disabled.
- `IconButton`: menu, fechar e remover pessoa.
- `Header`: desktop; mobile fechado; mobile aberto. No mobile, o CTA “Vamos conversar” fica oculto e o menu permanece disponível.
- `ProfileCard`: pessoa/família e empresa; texto e ícone editáveis.
- `FormField`: texto e select; vazio, preenchido, foco e erro; rótulo e ajuda associados.
- `ProfileChoice`: seleção família/empresa.
- `BeneficiaryRow`: idade, ordinal e remoção; remoção desabilitada quando há apenas uma pessoa.
- `LocationControl`: disponível, consultando, sucesso, permissão negada, falha e edição manual preservada.
- `QuoteSummary`: resumo, continuar no WhatsApp, copiar, confirmação e falha de cópia.
- `FAQItem`: fechado e aberto.
- `PrivacyDialog`: cabeçalho, texto, botão fechar e confirmação.
- `Footer`: identificação, Instagram, privacidade e informação sobre operadoras.

## 03 — Desktop

Frame de referência proposto: **1440 px de largura**, altura ajustada ao conteúdo. Conteúdo limitado a 1160 px e centralizado. Incluir a página completa e anotações laterais, sem sobrepor notas à interface.

Ordem das seções: cabeçalho → abertura e ilustração → operadoras → perfis → processo → consultor → solicitação → dúvidas → rodapé.

Usar os textos atuais da aplicação, inclusive “Atendimento nacional”. A identificação do consultor usa monograma, sem foto fictícia. O coração e as órbitas devem continuar editáveis como elementos vetoriais.

## 04 — Mobile e comportamento responsivo

Frames propostos: **390 px**, **360 px** e **320 px**. Representar margens laterais de 20 px e seções em uma coluna. Os frames de 320 e 360 px servem para conferir limites, especialmente cabeçalho, botão, card ilustrado e formulário.

No código, a composição principal muda para mobile até 700 px. Há ajustes intermediários em 800 e 1050 px. Reproduzir o comportamento existente; os breakpoints não significam uma garantia de revisão visual já concluída.

Regras para Auto Layout: elementos de conteúdo em Fill container; altura em Hug contents; evitar largura fixa em textos e campos; manter os elementos decorativos dentro de seus limites. O selo de atendimento fica dentro do card no mobile. O botão principal acompanha a largura disponível.

## 05 — Formulário e estados

Campos: perfil, tipo de empresa quando aplicável, primeiro nome, localização opcional, estado, cidade e idades.

Tipos de empresa: **MEI**, **CAEPF**, **Outra empresa com CNPJ**, **Outros tipos de empresa**.

Estado e cidade iniciam vazios. A ação “Usar minha localização” requer autorização e usa BigDataCloud. Sem autorização ou resposta válida, o preenchimento manual continua disponível. Nome e endereço também permitem o preenchimento automático do navegador. Não simular que o site sabe a localização de toda pessoa que o abre.

Representar pelo menos: família vazia; empresa preenchida; erro de campo; duas pessoas; localização em andamento; localização indisponível; pedido pronto; pedido editado exigindo nova preparação; sucesso/falha de cópia.

Idades inteiras de 0 a 120; entre 1 e 20 pessoas. Tipo de empresa obrigatório para o perfil empresarial. A seleção de perfil pelos cards preserva os demais dados. O resumo mostra a cidade e a UF escolhidas.

Dados ilustrativos dos frames devem estar identificados como exemplos, sem dados de clientes reais.

## 06 — Protótipo

Conectar os caminhos principais:

1. CTA inicial → formulário.
2. Card família/empresa → formulário no perfil correspondente.
3. Pedido válido → resumo → saída para WhatsApp.
4. Pedido inválido → erros junto aos campos.
5. Editar após preparar → resumo deixa de estar disponível até nova preparação.
6. Menu móvel → seção desejada; fechamento pelo botão/Escape.
7. Privacidade → diálogo → retorno ao elemento de origem.

As telas de permissão e os serviços externos são representações explicativas; um protótipo do Figma não deve ser apresentado como execução real de geolocalização ou envio de mensagem.

## 07 — Implementação e case

Associar componentes do design aos arquivos de `src/components`, `src/sections` e `src/features/quote`. Incluir decisões de [ARCHITECTURE.md](ARCHITECTURE.md) e contexto de [CASE.md](CASE.md).

Separar o que foi implementado do que é planejado: relatório diário de acessos e publicação ainda pendentes. Não criar métricas fictícias, depoimentos ou selos de certificação. Registrar as limitações de revisão visual e o uso de IA com supervisão humana.

## Critérios para finalizar o arquivo editável

Nomes de páginas e camadas legíveis; componentes com variantes úteis; cores em estilos/variáveis; textos editáveis; Auto Layout consistente; fluxos principais conectados; correspondência conferida com a versão atual do site. Capturas de tela podem ilustrar o case, mas não substituem os frames editáveis.
