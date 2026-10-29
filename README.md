# Lucas Bacelar Saúde

Landing page de consultoria de planos de saúde em Fortaleza, criada para um uso comercial real e como projeto de portfólio de Lucas Bacelar.

**Status:** implementação local. Instagram e WhatsApp de Fortaleza configurados. Ainda não publicado. A conferência visual em navegadores e a validação comercial dos produtos são etapas anteriores ao lançamento.

## Executar

Requer Node.js 22.12 ou superior; recomendado Node.js 24.

```sh
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite. A versão React precisa desse servidor durante o desenvolvimento; não abra `index.html` diretamente pelo Explorador.

Para conferir sem servidor, execute `npm run build` e depois `node scripts/create-preview.mjs`. Abra o arquivo gerado `preview.html` no navegador. Ele reúne os assets do build para revisão local; publique `dist/` em produção.

## Tecnologias e decisões

| Ferramenta               | Responsabilidade                            |
| ------------------------ | ------------------------------------------- |
| React + TypeScript       | Componentes e contratos tipados             |
| Vite                     | Desenvolvimento e build estático            |
| CSS Modules              | Estilos locais por componente               |
| React Hook Form + Zod    | Campos dinâmicos e regras de validação      |
| Lucide React             | Ícones consistentes e vetoriais             |
| Vitest + Testing Library | Regras de negócio e interação do formulário |
| ESLint + Prettier        | Qualidade e formatação do código            |
| GitHub Actions           | Checks e publicação manual no Pages         |

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

Identidade: azul profundo `#06274B`, creme `#FFF3DE` e dourado `#E1B96C`. Sem fontes, scripts de rastreamento ou imagens remotas. A arte do topo usa CSS e ícone vetorial; o monograma de apresentação é tipográfico, sem foto fictícia do consultor.

## Qualidade

```sh
npm run check       # Lint, testes, TypeScript, build e formatação
npm run test:watch  # Desenvolvimento dos testes
npm run preview    # Servir dist/ depois do build
```

Os testes verificam idade zero, limites, dados inválidos, perfil empresarial, codificação da mensagem, remoção de pessoas, invalidação do resumo editado e falha de clipboard. Não substituem testes visuais nem um envio real pelo WhatsApp.

## Personalização

Edite `src/config/site.ts` para alterar os contatos públicos. Nunca adicione credenciais a esse arquivo. O atendimento inicial é Fortaleza; São Paulo fica para uma futura expansão. Confirme produtos, rede e condições antes de divulgar o site.

## GitHub e publicação

O build gera `dist/`, compatível com hospedagem estática. `base: './'` permite hospedagem em uma subpasta, inclusive GitHub Pages. Não há rotas de servidor.

1. Crie o repositório `lucas-bacelar-saude` na conta desejada.
2. Envie o código e o `package-lock.json`, sem `node_modules` ou `dist`.
3. Em Settings → Pages, selecione GitHub Actions.
4. Execute manualmente o workflow “Publicar no GitHub Pages”.

O workflow de publicação não roda automaticamente em push. O workflow de qualidade roda em push e pull request.

Antes do lançamento: conferir desktop e celular, navegação por teclado, diálogo de privacidade e envio real; confirmar informações comerciais e procedimentos de retenção do atendimento; definir hospedagem e domínio; adicionar URL canônica e imagem social com o endereço final. Consulte [o case](docs/CASE.md).

## Autoria e direitos

Projeto de Lucas Bacelar com assistência de IA. Não há resultados comerciais ou métricas de conversão medidos. Não há licença aberta definida. Marcas de operadoras pertencem aos respectivos titulares; este site apresenta um consultor independente.
