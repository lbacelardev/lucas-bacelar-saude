# Relatório diário — requisito futuro

**Estado: planejado, sem coleta, agendamento ou envio ativo.** O projeto ainda não está publicado. Este documento não representa uma integração implementada.

## Requisito confirmado

- Envio diário às 21h, fuso `America/Sao_Paulo`.
- Destinatário informado por Lucas, guardado no arquivo local `reporting-plan.local.json`, ignorado pelo Git. O destinatário não deve fazer parte do bundle do navegador.
- Métrica pedida: quantidade de acessos.

## Definições propostas antes da implementação

Separar visitantes, sessões e visualizações; recarregar uma página não representa necessariamente uma pessoa nova. Uma janela possível é das 21h do dia anterior às 21h do dia do relatório, com início e fim explícitos. A janela ainda precisa ser confirmada antes da ativação.

Cliques em WhatsApp e Instagram podem ser métricas adicionais. Um clique externo não é uma mensagem entregue, lead validado ou venda. Não vincular as métricas aos dados do formulário.

## Dependências

1. Publicar a versão revisada e definir o domínio.
2. Escolher e configurar uma fonte de medição real.
3. Atualizar a informação de privacidade para refletir a ferramenta escolhida.
4. Configurar um serviço de e-mail e verificar o remetente.
5. Guardar credenciais e destinatário apenas no ambiente do serviço que gerar os relatórios.
6. Configurar a execução às 21h no fuso solicitado; testar coleta, geração, entrega e prevenção de duplicidade.

## Comportamento esperado

- Fonte indisponível deve gerar falha identificável; não deve ser interpretada como zero visitas.
- Exibir período, fuso e fonte no relatório.
- Evitar enviar duas vezes o mesmo período em uma repetição da tarefa.
- Contabilizar as limitações da medição, inclusive bloqueadores e tráfego automatizado.
- Enviar um e-mail de teste antes de ativar o envio recorrente.

O serviço de relatório deverá funcionar independentemente do computador pessoal estar ligado. Sua escolha é posterior à definição da hospedagem. Nenhuma credencial deve ser incluída no GitHub ou no código React.
