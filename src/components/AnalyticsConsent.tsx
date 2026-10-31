import { useEffect, useState } from 'react';
import styles from './AnalyticsConsent.module.css';

const storageKey = 'lb-analytics-consent-v1';

function savedChoice() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function AnalyticsConsent() {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
  const enabled = /^G-[A-Z0-9]+$/.test(measurementId || '');
  const [choice, setChoice] = useState(savedChoice);
  const [settings, setSettings] = useState(false);
  useEffect(() => {
    if (!enabled || choice !== 'accepted' || document.getElementById('lb-ga4')) return;
    // A fila fica isolada dos campos do formulário e dos links para WhatsApp.
    const analyticsWindow = window as typeof window & { dataLayer?: unknown[] };
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    function gtag(...args: unknown[]) {
      void args;
      // A biblioteca gtag espera objetos Arguments na fila de comandos.
      // eslint-disable-next-line prefer-rest-params
      analyticsWindow.dataLayer!.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: window.location.origin + window.location.pathname,
      page_referrer: '',
      page_title: 'Lucas Bacelar Saúde',
    });
    gtag('event', 'page_view');
    const script = document.createElement('script');
    script.id = 'lb-ga4';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }, [choice, enabled, measurementId]);

  if (!enabled) return null;
  function select(value: string) {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* Escolha vale nesta visita. */
    }
    if (choice === 'accepted' && value === 'denied') {
      // Interrompe a execução da biblioteca carregada e remove seus cookies neste domínio.
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0];
        if (!name.startsWith('_ga')) continue;
        const parts = window.location.hostname.split('.');
        document.cookie = `${name}=; Max-Age=0; path=/`;
        while (parts.length > 1) {
          document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.join('.')}`;
          parts.shift();
        }
      }
      window.location.reload();
      return;
    }
    setChoice(value);
    setSettings(false);
  }
  return (
    <aside className={styles.consent} aria-label="Preferências de análise de acessos">
      {!choice || settings ? (
        <>
          <p>
            Você permite o uso do Google Analytics para medir visitas? A análise usa cookies e dados
            técnicos. Não enviamos os campos do formulário. Sua escolha não interfere no
            atendimento.
          </p>
          <div>
            <button type="button" onClick={() => select('accepted')}>
              Permitir análise
            </button>
            <button type="button" onClick={() => select('denied')}>
              Recusar análise
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setSettings(true)}>
          Preferências de análise
        </button>
      )}
    </aside>
  );
}
