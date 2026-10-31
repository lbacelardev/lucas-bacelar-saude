import { createHash, createSign } from 'node:crypto';

export const timezone = 'America/Sao_Paulo';

export function reportDate(now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function required(env, key) {
  if (!env[key]?.trim()) throw new Error(`Configure o segredo ${key}.`);
  return env[key].trim();
}

async function request(url, options, fetcher) {
  const response = await fetcher(url, { ...options, signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    let detail = '';
    if (new URL(url).hostname === 'api.brevo.com') {
      try {
        const error = await response.json();
        let message = String(error.message || 'Sem descrição.');
        const payload = JSON.parse(options.body);
        for (const secret of [
          options.headers['api-key'],
          payload.sender?.email,
          ...payload.to.map((to) => to.email),
        ]) {
          if (secret) message = message.split(secret).join('[oculto]');
        }
        message = message
          .replace(/[\w.+-]+@[\w.-]+/g, '[email]')
          .replace(/[\r\n]/g, ' ')
          .slice(0, 500);
        const code = String(error.code || 'unknown')
          .replace(/[^a-zA-Z0-9_]/g, '')
          .slice(0, 60);
        detail = ` Brevo ${code}: ${message}`;
      } catch {
        detail = ' Resposta de erro sem JSON legível.';
      }
    }
    throw new Error(`Serviço ${new URL(url).hostname}: HTTP ${response.status}.${detail}`);
  }
  return response.json();
}

export async function accessToken(credentials, fetcher = fetch) {
  const account = JSON.parse(credentials);
  if (!account.client_email || !account.private_key) throw new Error('Conta de serviço inválida.');
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(account.private_key, 'base64url');
  const result = await request(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${unsigned}.${signature}`,
      }),
    },
    fetcher,
  );
  if (!result.access_token) throw new Error('Google não retornou token de acesso.');
  return result.access_token;
}

export async function readMetrics(property, token, date, fetcher = fetch) {
  if (!/^\d+$/.test(property)) throw new Error('GA4_PROPERTY_ID deve ser numérico.');
  const data = await request(
    `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: date, endDate: date }],
        metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
      }),
    },
    fetcher,
  );
  if (data.metadata?.timeZone !== timezone)
    throw new Error(`Configure o fuso da propriedade GA4 como ${timezone}.`);
  const expected = ['totalUsers', 'sessions', 'screenPageViews'];
  const names = Array.isArray(data.metricHeaders) ? data.metricHeaders.map((h) => h.name) : [];
  const noRows = data.rows === undefined || (Array.isArray(data.rows) && data.rows.length === 0);
  if (
    data.kind === 'analyticsData#runReport' &&
    names.length === 0 &&
    noRows &&
    (data.rowCount === undefined || data.rowCount === 0)
  ) {
    // Relatório reconhecido, mas sem colunas: não há base para afirmar zero acessos.
    console.log(
      'GA4 retornou relatório vazio sem colunas. O e-mail indicará métricas indisponíveis.',
    );
    return [null, null, null];
  }
  if (names.length !== expected.length || !expected.every((name) => names.includes(name))) {
    // Somente nomes de colunas para diagnóstico. Nunca registrar o corpo da resposta.
    const diagnostic = names
      .map((name) =>
        String(name)
          .replace(/[^a-zA-Z0-9_:]/g, '')
          .slice(0, 80),
      )
      .join(', ');
    throw new Error(
      `Resposta de métricas inesperada. Colunas recebidas: [${diagnostic}]. Esperadas: [${expected.join(', ')}].`,
    );
  }
  const values = data.rows?.[0]?.metricValues;
  if (!values && data.rowCount) throw new Error('Resposta sem totais.');
  if (values && values.length !== names.length) throw new Error('Quantidade de totais inesperada.');
  const totals = values
    ? expected.map((name) => {
        const raw = values[names.indexOf(name)]?.value;
        return typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : NaN;
      })
    : [0, 0, 0];
  if (totals.length !== 3 || totals.some((n) => !Number.isSafeInteger(n) || n < 0))
    throw new Error('Totais inválidos.');
  return totals;
}

export function emailBody(date, totals, test = false) {
  const display = (value) =>
    value === null ? 'Indisponível — a fonte retornou relatório sem métricas' : value;
  return {
    subject: `${test ? '[TESTE] ' : ''}Lucas Bacelar Saúde — acessos de ${date}`,
    textContent: `Relatório de acessos — Lucas Bacelar Saúde\n\nPeríodo: ${date}, 00:00–23:59:59 (${timezone}).\nFonte: Google Analytics 4.\n\nUsuários: ${display(totals[0])}\nSessões: ${display(totals[1])}\nVisualizações de página: ${display(totals[2])}\n\nDados provisórios: processamento pode levar 24–48 horas. Métricas indisponíveis não significam zero acessos; confira a coleta e o período no Analytics. Medição limitada a visitantes que autorizaram análise, sujeita a bloqueadores e filtros do Google. Zero significa nenhum evento retornado pela fonte, não prova ausência de visitas. Cliques não representam mensagens ou vendas.\n`,
  };
}

export async function sendReport(env, date, totals, test = false, fetcher = fetch) {
  const recipient = required(env, 'REPORT_RECIPIENT');
  const sender = required(env, 'REPORT_SENDER');
  // UUID v5 determinístico (namespace DNS): 36 caracteres, conforme o contrato Brevo.
  const bytes = createHash('sha1')
    .update(Buffer.from('6ba7b8109dad11d180b400c04fd430c8', 'hex'))
    .update(
      `lucasbacelarsaude.netlify.app:${date}:${recipient}:${test ? 'test:' + (env.GITHUB_RUN_ID || Date.now()) : 'daily'}`,
    )
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  const key = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  const result = await request(
    'https://api.brevo.com/v3/smtp/email',
    {
      method: 'POST',
      headers: { 'api-key': required(env, 'BREVO_API_KEY'), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { email: sender, name: 'Lucas Bacelar Saúde' },
        to: [{ email: recipient }],
        headers: { idempotencyKey: key },
        ...emailBody(date, totals, test),
      }),
    },
    fetcher,
  );
  if (!result.messageId)
    throw new Error('Brevo não confirmou o aceite. Confira o painel antes de repetir.');
}
