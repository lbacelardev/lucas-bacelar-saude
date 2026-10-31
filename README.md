# Lucas Bacelar Saúde

Landing page de consultoria de planos de saúde em todo o Brasil, criada para um uso comercial real e como projeto de portfólio de Lucas Bacelar.

O problema é transformar uma visita em uma conversa útil, reduzindo a necessidade de perguntar novamente nome, cidade e idades no primeiro contato. O visitante preenche, revisa e decide compartilhar o pedido pelo WhatsApp. O formulário orienta o atendimento; consultar uma API de preços está fora do escopo.

**Status:** implementação local, ainda não publicada. Instagram e WhatsApp comercial configurados. Responsividade e fluxo principal verificados no Chromium; validação em dispositivos reais e conferência comercial continuam antes do lançamento.

![Página inicial em desktop](docs/images/desktop-top.png)

[Página completa em desktop](docs/images/desktop.png) · [Página completa em mobile](docs/images/mobile.png)

## Guia para conhecer o projeto

1. Execute a página e percorra **perfil → formulário → revisão → WhatsApp**. Não é necessário enviar a mensagem para conhecer o fluxo.
2. Leia [o case](docs/CASE.md) para entender o problema e o contexto comercial.
3. Veja [arquitetura e decisões](docs/ARCHITECTURE.md), incluindo as consequências de cada escolha.
4. Consulte `src/features/quote/quote.ts` para as regras e `QuoteForm.test.tsx` para os testes de interação.
5. Consulte [as verificações de navegador](docs/VALIDATION.md) para conhecer a cobertura e os limites dos testes.

O projeto demonstra um fluxo completo de frontend, com escopo deliberadamente limitado. Não há números de conversão, desempenho ou acessibilidade apresentados como resultados medidos.

## Executar

Requer Node.js 22.12 ou superior; recomendado Node.js 24.

```sh
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite. A versão React precisa desse servidor durante o desenvolvimento; não abra `index.html` diretamente pelo Explorador.

Para conferir sem servidor, execute `npm run build` e depois `node scripts/create-preview.mjs`. Abra o arquivo gerado `preview.html` no navegador. Ele reúne os assets do build para revisão local; publique `dist/` em produção.

## Tecnologias e decisões

| Ferramenta               | Responsabilidade                                    |
| ------------------------ | --------------------------------------------------- |
| React + TypeScript       | Componentes e contratos tipados                     |
| Vite                     | Desenvolvimento e build estático                    |
| CSS Modules              | Estilos locais por componente                       |
| React Hook Form + Zod    | Campos dinâmicos e regras de validação              |
| Lucide React             | Ícones consistentes e vetoriais                     |
| Vitest + Testing Library | Regras de negócio e interação do formulário         |
| Playwright               | Responsividade, navegação e fluxo em navegador real |
| ESLint + Prettier        | Qualidade e formatação do código                    |
| GitHub Actions           | Checks e publicação manual no Pages                 |

Sem backend: o visitante prepara o pedido no navegador, revisa e decide abrir o WhatsApp. O envio é confirmado no aplicativo. Não há preço automático, contratação, CRM ou persistência de dados. Não são coletados CPF ou informações de saúde.

## Estrutura

```text
src/
  components/          # Marca e diálogo de privacidade
  config/site.ts       # Informações públicas e contato comercial
  sections/            # Seções da landing page
  features/quote/      # Schema, mensagem, formulário e testes
  styles/global.css   # Tokens, base e elementos compartilhados
  App.tsx             # Composição da landing page
  App.module.css      # Layout e responsividade da página
```

Identidade: azul profundo `#06274B`, creme `#FFF3DE` e dourado `#E1B96C`. Sem fontes, scripts de rastreamento ou imagens remotas. A consulta opcional de localização usa um serviço externo. A arte do topo usa CSS e ícone vetorial; o monograma de apresentação é tipográfico, sem foto fictícia do consultor.

## Qualidade

```sh
npm run check       # Lint, testes, TypeScript, build e formatação
npm run test:watch  # Desenvolvimento dos testes
npm run preview    # Servir dist/ depois do build
```

Para verificar o navegador:

```sh
npx playwright install chromium --only-shell
npm run test:e2e
```

O Playwright inicia o servidor local automaticamente. Em Linux, use `npx playwright install --with-deps chromium --only-shell`. A CI executa os testes unitários e os testes de navegador; o histórico de execução remota existirá após enviar o repositório.

Para atualizar as capturas do README, rode `node scripts/capture-previews.mjs`. O script inicia e encerra seu próprio servidor, usa dados vazios e bloqueia requisições externas.

Os testes verificam idade zero, limites, dados inválidos, perfil empresarial, codificação da mensagem, remoção de pessoas, invalidação do resumo editado, preservação do preenchimento ao trocar o perfil, falha de clipboard e fechamento do menu por teclado. Não substituem testes visuais nem um envio real pelo WhatsApp.

## Relatórios de acessos

O relatório diário às **22h (America/Sao_Paulo)** está implementado com Google Analytics 4, Brevo e GitHub Actions. Aguarda configuração das contas, credenciais e teste real de entrega para ativação. A análise é opcional e só carrega após permissão. O destinatário e as credenciais ficam em segredos, fora do bundle do site. Consulte [REPORTING.md](docs/REPORTING.md) para configurar e executar o teste identificado por e-mail.

## Personalização

### Localização opcional

“Usar minha localização” solicita permissão ao navegador e consulta cidade e UF no BigDataCloud. Não há consulta automática ao abrir a página, nem busca por IP se a permissão for negada. O preenchimento pelo navegador continua disponível com `autocomplete`. Os campos ficam editáveis, e uma consulta atrasada não sobrescreve edições manuais. Sem localização, não presumimos Fortaleza ou qualquer outra cidade.

A localização exige suporte e permissão do navegador; use `localhost` no desenvolvimento ou HTTPS em produção. Coordenadas são enviadas ao serviço externo somente ao acionar a funcionalidade e não são armazenadas nem incluídas no WhatsApp. A fonte é a [API client-side do BigDataCloud](https://www.bigdatacloud.com/docs/article/why-is-reverse-geocoding-api-free). O aviso de privacidade descreve essa consulta.

Os testes de localização usam respostas simuladas, sem obter nem enviar coordenadas reais. O uso em um dispositivo real ainda precisa ser conferido na revisão de navegador.

Edite `src/config/site.ts` para alterar os contatos públicos. Nunca adicione credenciais a esse arquivo. O atendimento é nacional. O formulário recebe cidade e UF e oferece preenchimento opcional por localização autorizada. Confirme produtos, rede e condições antes de divulgar o site.

## GitHub e publicação

O código está no [GitHub](https://github.com/lbacelardev/lucas-bacelar-saude), com CI aprovada. O build gera `dist/`, compatível com hospedagem estática. `base: './'` permite hospedagem em uma subpasta. Não há rotas de servidor.

Para a versão comercial, a hospedagem ainda será escolhida. Consulte [o roteiro de lançamento](docs/LAUNCH.md), com parâmetros de build, pendências e verificações na URL final. GitHub Pages tem restrições de uso comercial e não é o destino indicado para esta landing page de captação.

O workflow manual de Pages existente não foi executado e não deve ser usado no lançamento comercial. O workflow de qualidade roda em push e pull request.

Antes do lançamento: conferir desktop e celular, navegação por teclado, diálogo de privacidade e envio real; confirmar informações comerciais e procedimentos de retenção do atendimento; definir hospedagem e domínio; adicionar URL canônica e imagem social com o endereço final. Consulte [o case](docs/CASE.md).

## Autoria e direitos

Projeto desenvolvido com uso de inteligência artificial (ChatGPT/Codex), sob orientação e acompanhamento de Lucas Bacelar. Lucas definiu os requisitos e a direção do produto, auditou as entregas e realizou revisões e refatorações conforme necessário. A IA foi utilizada como ferramenta de apoio à implementação, aos testes e à documentação.

Não há resultados comerciais ou métricas de conversão medidos. Não há licença aberta definida. Marcas de operadoras pertencem aos respectivos titulares; este site apresenta um consultor independente.
