# Verificações do projeto

## Navegador

Em 30/10/2026, os dez cenários de `e2e/landing.spec.ts` passaram no Chromium Headless Shell em Windows:

- Oito larguras: 320, 360, 390, 700, 768, 800, 1024 e 1440 px. Ausência de rolagem horizontal, controles dentro da largura útil e navegação disponível.
- Pedido empresarial: validação, seleção das quatro categorias de empresa, duas idades incluindo zero, cidade/UF, destinatário correto do WhatsApp e invalidação do resumo ao editar.
- Diálogo de privacidade: abertura, fechamento por Escape e retorno do foco ao botão de origem.

As capturas desktop e mobile em `docs/images/` vêm da aplicação real e foram inspecionadas visualmente. O menu passa a estar disponível até 800 px; o formulário usa uma coluna nessa faixa para preservar a largura dos controles. O Figma ficou fora desta etapa.

## Conferência do responsável pelo projeto

Lucas conferiu a navegação e o formulário em desktop e mobile e informou que o funcionamento estava adequado. Essa aprovação manual complementa os cenários automatizados acima. Navegadores, aparelhos e versões não foram especificados; portanto, não representa uma certificação de compatibilidade ampla.

## Reproduzir os testes

```sh
npm ci
npm run check
npx playwright install chromium --only-shell
npm run test:e2e
node scripts/capture-previews.mjs
```

No Linux, instale as dependências do navegador com `npx playwright install --with-deps chromium --only-shell`. Relatórios e rastros de falhas ficam em diretórios ignorados pelo Git. A CI guarda o relatório quando um cenário falha.

## Limites

Os testes não enviam mensagens nem coordenadas reais. Não certificam compatibilidade com Safari/Firefox, aparelhos físicos, leitores de tela, qualidade comercial da oferta, entrega de WhatsApp ou funcionamento do serviço externo de localização. Essas verificações continuam necessárias antes do lançamento. Não há pontuação de Lighthouse, conversão ou acessibilidade declarada sem medição.
