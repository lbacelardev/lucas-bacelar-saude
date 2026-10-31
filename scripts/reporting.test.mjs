import test from 'node:test';
import assert from 'node:assert/strict';
import { emailBody, readMetrics, reportDate, sendReport } from './reporting.mjs';

test('período respeita São Paulo na virada UTC e na virada do ano', () => {
  assert.equal(reportDate(new Date('2026-10-31T01:00:00Z')), '2026-10-29');
  assert.equal(reportDate(new Date('2027-01-01T02:59:00Z')), '2026-12-30');
  assert.equal(reportDate(new Date('2027-01-01T03:00:00Z')), '2026-12-31');
});

const headers = ['totalUsers', 'sessions', 'screenPageViews'].map((name) => ({ name }));
const response = (data) => async () => ({ ok: true, json: async () => data });
test('relatório GA4 identificado sem colunas informa indisponibilidade, nunca zero', async () => {
  const totals = await readMetrics(
    '123',
    'token',
    '2026-10-29',
    response({
      kind: 'analyticsData#runReport',
      metadata: { timeZone: 'America/Sao_Paulo', emptyReason: 'No data' },
    }),
  );
  assert.deepEqual(totals, [null, null, null]);
  const email = emailBody('2026-10-29', totals, true);
  assert.match(email.textContent, /Usuários: Indisponível/);
  assert.doesNotMatch(email.textContent, /Usuários: 0/);
});
test('cabeçalhos ausentes com linhas ou contagem positiva continuam sendo erro', async () => {
  for (const extra of [{ rowCount: 1 }, { rows: [{ metricValues: [{ value: '4' }] }] }]) {
    await assert.rejects(
      readMetrics(
        '123',
        'token',
        '2026-10-29',
        response({
          kind: 'analyticsData#runReport',
          metadata: { timeZone: 'America/Sao_Paulo' },
          ...extra,
        }),
      ),
      /inesperada/,
    );
  }
});
test('associa totais pelo nome das colunas, independentemente da ordem', async () => {
  const fetcher = response({
    metadata: { timeZone: 'America/Sao_Paulo' },
    metricHeaders: ['sessions', 'screenPageViews', 'totalUsers'].map((name) => ({ name })),
    rows: [{ metricValues: [{ value: '7' }, { value: '10' }, { value: '5' }] }],
  });
  assert.deepEqual(await readMetrics('123', 'token', '2026-10-29', fetcher), [5, 7, 10]);
});
test('diagnóstico de colunas ausentes não transforma resposta incompleta em zero', async () => {
  await assert.rejects(
    readMetrics(
      '123',
      'token',
      '2026-10-29',
      response({
        metadata: { timeZone: 'America/Sao_Paulo' },
      }),
    ),
    /Colunas recebidas: \[\]/,
  );
});
test('consulta período explícito e interpreta totais', async () => {
  const metrics = await readMetrics('123', 'token', '2026-10-29', async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body).dateRanges, [
      { startDate: '2026-10-29', endDate: '2026-10-29' },
    ]);
    return {
      ok: true,
      json: async () => ({
        metadata: { timeZone: 'America/Sao_Paulo' },
        metricHeaders: headers,
        rows: [{ metricValues: [{ value: '5' }, { value: '7' }, { value: '10' }] }],
      }),
    };
  });
  assert.deepEqual(metrics, [5, 7, 10]);
});
test('falha de rede/API ou fuso inválido não vira zero visitas', async () => {
  await assert.rejects(
    readMetrics('123', 'token', '2026-10-29', async () => ({ ok: false, status: 403 })),
    /HTTP 403/,
  );
  await assert.rejects(
    readMetrics('123', 'token', '2026-10-29', response({ metadata: { timeZone: 'UTC' } })),
    /fuso/,
  );
  await assert.rejects(
    readMetrics(
      '123',
      'token',
      '2026-10-29',
      response({ metadata: { timeZone: 'America/Sao_Paulo' } }),
    ),
    /inesperada/,
  );
});
test('resposta válida vazia significa nenhum evento retornado', async () => {
  assert.deepEqual(
    await readMetrics(
      '123',
      'token',
      '2026-10-29',
      response({ metadata: { timeZone: 'America/Sao_Paulo' }, metricHeaders: headers }),
    ),
    [0, 0, 0],
  );
});
test('e-mail identifica teste, período, fonte e dados provisórios', () => {
  const email = emailBody('2026-10-29', [1, 2, 3], true);
  assert.match(email.subject, /\[TESTE\]/);
  assert.match(email.textContent, /Usuários: 1\nSessões: 2\nVisualizações de página: 3/);
  assert.match(email.textContent, /provisórios/);
});
test('envio exige credenciais e confirmação do provedor', async () => {
  await assert.rejects(sendReport({}, '2026-10-29', [0, 0, 0]), /REPORT_RECIPIENT/);
  const env = {
    REPORT_RECIPIENT: 'to@example.com',
    REPORT_SENDER: 'from@example.com',
    BREVO_API_KEY: 'secret',
  };
  await assert.rejects(
    sendReport(env, '2026-10-29', [0, 0, 0], false, response({})),
    /não confirmou/,
  );
  const keys = [];
  const fetcher = async (_url, options) => {
    const body = JSON.parse(options.body);
    keys.push(body.headers.idempotencyKey);
    assert.equal(body.to[0].email, 'to@example.com');
    return { ok: true, json: async () => ({ messageId: 'accepted' }) };
  };
  await sendReport(env, '2026-10-29', [1, 2, 3], false, fetcher);
  await sendReport(env, '2026-10-29', [1, 2, 3], false, fetcher);
  assert.equal(keys[0], keys[1]);
});

test('recusa Brevo inclui motivo e oculta chave e endereços', async () => {
  const env = {
    REPORT_RECIPIENT: 'to@example.com',
    REPORT_SENDER: 'from@example.com',
    BREVO_API_KEY: 'private-key',
  };
  await assert.rejects(
    sendReport(env, '2026-10-29', [null, null, null], true, async () => ({
      ok: false,
      status: 400,
      json: async () => ({
        code: 'invalid_parameter',
        message: 'Sender from@example.com invalid for to@example.com private-key',
      }),
    })),
    (error) => {
      assert.match(error.message, /invalid_parameter/);
      assert.match(error.message, /Sender/);
      assert.doesNotMatch(error.message, /example.com|private-key/);
      return true;
    },
  );
});
