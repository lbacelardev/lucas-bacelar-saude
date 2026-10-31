# Case: da solicitação à conversa

## Contexto

Lucas Bacelar oferece atendimento como corretor de planos de saúde para todo o Brasil, com disponibilidade de produtos confirmada por cidade e UF. O site precisa apresentar seu trabalho, organizar o primeiro contato e funcionar como projeto de portfólio.

## Problema da primeira versão

O protótipo estático validou conteúdo e paleta, mas tinha arquivos comprimidos e estilos sobrepostos. O formulário ainda não tinha uma estrutura adequada para evolução e testes.

## Limite do produto

A landing page apresenta o consultor e direciona o interessado ao contato. O formulário é mantido porque organiza esse primeiro contato; ele não consulta uma API de cotação nem precisa de uma para cumprir sua finalidade.

A complexidade técnica se concentra na experiência: validação condicional para empresas, lista de pessoas, preservação do preenchimento e revisão explícita antes de compartilhar. A escolha da stack não altera esse limite de produto.

## Implementação

- Componentes React com estilos locais e configuração pública separada.
- TypeScript em modo estrito.
- Schema Zod compartilhado pela validação e pela construção da mensagem.
- React Hook Form para registro e inclusão/remoção das pessoas.
- Resumo invalidado quando os campos mudam, impedindo envio de dados desatualizados.
- Mensagem codificada no link do WhatsApp, sem backend ou credenciais.
- Liberdade para copiar o pedido e alternativa manual quando o navegador bloqueia a cópia.
- Foco no resultado após preparação, rótulos explícitos, erros associados aos campos, menu móvel e preferência de movimento reduzido.
- Privacidade em diálogo nativo, com fechamento pelo teclado e controle de foco pelo navegador.

## Design

A paleta preserva a decisão anterior: azul profundo, creme e dourado suave. Tipografia de sistema para leitura; Georgia para os destaques editoriais. Layout com seções distintas para contexto, público, processo, consultor, cotação e dúvidas.

Sem depoimentos inventados, selos de certificação ou métricas sem evidência. O monograma é uma escolha provisória de identidade e não simula uma fotografia de Lucas.

## Limites e próximos passos

Os testes locais não comprovam aparência em todos os dispositivos nem entrega de mensagem no WhatsApp. Antes de publicar, revisar a experiência em desktop e celular, confirmar os produtos comercializados e os procedimentos de retenção de dados no atendimento.

Capturas reais já estão no README, e o código está no [GitHub](https://github.com/lbacelardev/lucas-bacelar-saude), com CI aprovada. Lucas conferiu navegação e formulário em desktop e mobile. A próxima etapa é definir a hospedagem e publicar conforme [o roteiro de lançamento](LAUNCH.md); depois, adicionar o endereço público e eventuais resultados medidos. O formulário contempla todas as UFs e preenchimento opcional de localização. O relatório diário de acessos às 22h está implementado com GA4 e Brevo, aguardando configuração e teste real de entrega. API de cotação e CRM estão fora do escopo atual.

Consulte [a arquitetura](ARCHITECTURE.md) para os motivos e as consequências das escolhas técnicas.

## Processo de desenvolvimento e uso de IA

O projeto utilizou inteligência artificial (ChatGPT/Codex) na implementação, nos testes e na documentação. Lucas Bacelar orientou e acompanhou o desenvolvimento, definiu os requisitos e a direção do produto, auditou as entregas e realizou revisões e refatorações conforme necessário. Essa participação humana faz parte do processo de desenvolvimento e é explicitada na apresentação do projeto.

A documentação descreve o trabalho realizado sem atribuir resultados comerciais ou verificações ainda não observados.
