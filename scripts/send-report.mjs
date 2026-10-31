import { mkdir, writeFile, access } from 'node:fs/promises';
import { accessToken, readMetrics, reportDate, required, sendReport } from './reporting.mjs';

const date = reportDate();
const test = process.env.REPORT_TEST === 'true' || process.argv.includes('--test');
const marker = `.report-state/${date}.sent`;
try {
  if (process.argv.includes('--date')) {
    console.log(date);
  } else {
    let sent = false;
    try {
      await access(marker);
      sent = true;
    } catch {
      /* Primeiro envio deste período. */
    }
    if (sent && !test) {
      console.log('Período já enviado; execução ignorada.');
    } else {
      // Valida todas as configurações antes de consultar os serviços.
      for (const key of [
        'REPORT_RECIPIENT',
        'REPORT_SENDER',
        'BREVO_API_KEY',
        'GA4_PROPERTY_ID',
        'GA4_SERVICE_ACCOUNT_JSON',
      ])
        required(process.env, key);
      const token = await accessToken(required(process.env, 'GA4_SERVICE_ACCOUNT_JSON'));
      const totals = await readMetrics(required(process.env, 'GA4_PROPERTY_ID'), token, date);
      await sendReport(process.env, date, totals, test);
      if (!test) {
        await mkdir('.report-state', { recursive: true });
        await writeFile(marker, 'accepted\n');
      }
      console.log(
        'Brevo aceitou o relatório. A entrega deve ser conferida no painel ou na caixa de entrada.',
      );
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
