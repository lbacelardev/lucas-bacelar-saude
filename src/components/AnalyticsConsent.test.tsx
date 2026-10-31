import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AnalyticsConsent } from './AnalyticsConsent';

beforeEach(() => {
  localStorage.clear();
  vi.stubEnv('VITE_GA4_MEASUREMENT_ID', 'G-TEST123');
});
afterEach(() => {
  cleanup();
  document.getElementById('lb-ga4')?.remove();
  delete (window as typeof window & { dataLayer?: unknown[] }).dataLayer;
  vi.unstubAllEnvs();
});
test('não carrega Google antes da permissão nem após recusa', () => {
  render(<AnalyticsConsent />);
  expect(document.getElementById('lb-ga4')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Recusar análise' }));
  expect(document.getElementById('lb-ga4')).toBeNull();
  expect(localStorage.getItem('lb-analytics-consent-v1')).toBe('denied');
  fireEvent.click(screen.getByRole('button', { name: 'Preferências de análise' }));
  expect(screen.getByRole('button', { name: 'Permitir análise' })).toBeInTheDocument();
});
test('permissão carrega tag e remove query/hash da URL enviada', () => {
  window.history.replaceState(null, '', '/?nome=privado#segredo');
  render(<AnalyticsConsent />);
  fireEvent.click(screen.getByRole('button', { name: 'Permitir análise' }));
  expect(document.getElementById('lb-ga4')).not.toBeNull();
  const queue = (window as typeof window & { dataLayer?: unknown[] }).dataLayer!;
  const serialized = JSON.stringify(queue);
  expect(serialized).toContain('page_view');
  expect(serialized).not.toContain('privado');
  expect(serialized).not.toContain('segredo');
  window.history.replaceState(null, '', '/');
});
test('sem ID configurado não exibe controles nem carrega análise', () => {
  vi.stubEnv('VITE_GA4_MEASUREMENT_ID', '');
  const { container } = render(<AnalyticsConsent />);
  expect(container).toBeEmptyDOMElement();
});
