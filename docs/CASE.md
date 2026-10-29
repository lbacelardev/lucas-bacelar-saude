# Case: da solicitação à conversa

## Contexto

Lucas Bacelar inicia o atendimento como corretor de planos de saúde em Fortaleza e pretende expandir para São Paulo posteriormente. O site precisa apresentar seu trabalho, organizar o primeiro contato e funcionar como projeto de portfólio.

## Problema da primeira versão

O protótipo estático validou conteúdo e paleta, mas tinha arquivos comprimidos e estilos sobrepostos. O formulário ainda não tinha uma estrutura adequada para evolução e testes.

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

Depois da publicação, adicionar capturas reais, endereço público, link do repositório e resultados medidos. São Paulo, cotador e CRM são expansões futuras, não funcionalidades atuais.

Projeto com assistência de IA; a documentação registra a implementação sem atribuir resultados ainda não observados.
