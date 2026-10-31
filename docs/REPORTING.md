# Relatório diário de acessos

Implementado com Google Analytics 4, Brevo e GitHub Actions. **Aguardando contas, credenciais e teste real de entrega.** Instalar o código não ativa o envio. Não há dados simulados no relatório de produção.

## Horário e período

- **22:00, America/Sao_Paulo**. Workflow `.github/workflows/report.yml`, cron `0 1 * * *` (01h UTC = 22h do dia anterior em UTC-3).
- Período: **dia civil anterior**, 00h–23h59 no fuso de São Paulo. Dados provisórios: GA4 pode levar 24–48 horas para processá-los. Não é uma janela móvel de 22h a 22h.
- GitHub Actions pode atrasar; não garante chegada às 22h em ponto. Em repositórios públicos sem atividade por 60 dias, agendamentos podem ser desativados.
- `reporting-plan.local.json` é um registro local ignorado pelo Git. Seu `time` não controla o cron. Para mudar o horário real, editar o workflow e esta documentação.

## Configurar a medição

1. Criar uma propriedade no [Google Analytics](https://analytics.google.com/), com fuso **America/Sao_Paulo** (São Paulo no seletor).
2. Criar um fluxo web com a URL real do site Netlify.
3. **Desativar a medição otimizada inteira** no fluxo. Não habilitar coleta de dados fornecidos pelo usuário, Google Signals ou publicidade. Isso evita eventos automáticos de formulário e links de WhatsApp que podem conter dados pessoais.
4. Na Netlify, cadastrar a variável pública **VITE_GA4_MEASUREMENT_ID**, com o ID `G-...` do fluxo, e publicar novamente.
5. Abrir o site, permitir análise no final da página e verificar o painel em tempo real.

A tag só carrega após permissão. Recusar mantém o Google descarregado. A escolha pode ser revista no final da página. O código envia uma visualização, remove query e hash da URL e não envia referrer, campos ou textos de cotação. A análise fica limitada aos usuários que permitem, sujeita a bloqueadores e filtros. Não conta visitas anteriores à instalação. O ID `G-...` é público e difere do ID numérico da propriedade.

## Acesso de leitura à API

1. No [Google Cloud](https://console.cloud.google.com/), selecionar um projeto e habilitar **Google Analytics Data API**.
2. Criar uma conta de serviço e gerar uma chave JSON. Guardar fora do repositório.
3. Na administração da propriedade GA4, adicionar o `client_email` da conta como **Leitor**.
4. Anotar o ID numérico da propriedade. Não enviar chaves por chat.

## Preparar e-mail

Criar uma conta [Brevo](https://www.brevo.com/) na opção gratuita disponível. Cadastrar e verificar o remetente e criar uma chave de API transacional. Seguir as exigências exibidas pela Brevo; endereços gratuitos podem ser adaptados pelo provedor para entrega. Não pressupor que qualquer remetente será aceito. O destinatário informado por Lucas fica somente na configuração local e nos segredos de execução.

## GitHub e teste real

No repositório, abrir **Settings → Secrets and variables → Actions**. Cadastrar os **Repository secrets**:

| Segredo                    | Conteúdo                                 |
| -------------------------- | ---------------------------------------- |
| `GA4_PROPERTY_ID`          | ID numérico da propriedade               |
| `GA4_SERVICE_ACCOUNT_JSON` | JSON completo da conta de serviço        |
| `BREVO_API_KEY`            | Chave de API Brevo                       |
| `REPORT_SENDER`            | E-mail verificado na Brevo               |
| `REPORT_RECIPIENT`         | E-mail de Lucas para receber o relatório |

Criar a **Repository variable** `REPORTING_ENABLED` com valor `true`. Até isso, o job fica desabilitado. Nunca usar prefixo `VITE_` para segredos nem enviá-los ao frontend ou à Netlify.

Após enviar o código à branch principal:

1. Abrir **Actions → Relatório diário de acessos → Run workflow**.
2. Manter a opção de teste marcada. O e-mail real terá assunto `[TESTE]` e não marcará o envio diário como concluído.
3. Conferir Actions, painel de entrega Brevo, caixa de entrada e spam. Aceite da API não confirma entrega.
4. Comparar totais do mesmo período no Analytics. No início pode não haver dados processados.
5. Para suspender, alterar `REPORTING_ENABLED` para `false`.

Para teste local, colocar os mesmos segredos em `.env.reporting.local` (ignorado pelo Git) e executar `npm run report:test`. Esse comando envia um e-mail real identificado como teste. Os testes automatizados do projeto usam respostas simuladas e não enviam e-mails.

## Falhas e duplicação

Erros HTTP, autenticação inválida, resposta inesperada ou fuso divergente interrompem o job sem inventar zero visitas. Resposta válida com cabeçalhos e sem eventos retorna zero com limitação explícita no texto. Um relatório identificado pela API como analyticsData#runReport, sem cabeçalhos, sem linhas e sem contagem positiva, gera e-mail com métricas indisponíveis. Esse caso não é tratado como zero acessos. Falhas HTTP e respostas inconsistentes continuam interrompendo o envio.

O workflow serializa execuções, guarda um marcador por período no cache do Actions e usa chave de idempotência Brevo (validade de 15 minutos). Cache pode ser removido e o job pode falhar após o aceite: **não há garantia absoluta de envio único**. Em falha ambígua, conferir o painel Brevo antes de repetir. Testes manuais são independentes do marcador diário. Não há retry automático do POST de e-mail. Falhas ficam visíveis no Actions; não foram configurados alertas adicionais.

O e-mail contém somente totais, período, fuso e fonte. Não inclui dados do formulário.

## Referências

- [API GA4](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart)
- [Processamento GA4](https://support.google.com/analytics/answer/11198161)
- [Envio Brevo](https://developers.brevo.com/docs/send-a-transactional-email)
- [Idempotência Brevo](https://developers.brevo.com/changelog/2021/11/10)
- [Agendamento GitHub](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
