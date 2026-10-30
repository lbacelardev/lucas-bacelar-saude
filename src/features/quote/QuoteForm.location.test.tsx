import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QuoteForm } from './QuoteForm';
import { detectLocation } from './location';
import type { DetectedLocation } from './location';

vi.mock('./location', () => ({ detectLocation: vi.fn() }));
afterEach(() => vi.clearAllMocks());

describe('preenchimento por localização', () => {
  it('só consulta após o clique e envia a UF detectada', async () => {
    const user = userEvent.setup();
    vi.mocked(detectLocation).mockResolvedValue({ state: 'SP', city: 'São Paulo' });
    render(<QuoteForm selectedProfile="family" selectionKey={0} />);
    expect(detectLocation).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Sua cidade')).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Usar minha localização' }));
    await waitFor(() => expect(screen.getByLabelText('Seu estado')).toHaveValue('SP'));
    expect(screen.getByLabelText('Sua cidade')).toHaveValue('São Paulo');
    await user.type(screen.getByLabelText('Como posso chamar você?'), 'Ana');
    await user.type(screen.getByLabelText('Pessoa 1'), '35');
    await user.click(screen.getByRole('button', { name: /Preparar meu pedido/ }));
    const link = await screen.findByRole('link', { name: /Continuar no WhatsApp/ });
    expect(new URL(link.getAttribute('href')!).searchParams.get('text')).toContain(
      'Cidade: São Paulo / SP',
    );
  });
  it('preserva edições feitas enquanto a consulta está pendente', async () => {
    const user = userEvent.setup();
    let resolve!: (location: DetectedLocation) => void;
    vi.mocked(detectLocation).mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    render(<QuoteForm selectedProfile="family" selectionKey={0} />);
    await user.click(screen.getByRole('button', { name: 'Usar minha localização' }));
    await user.selectOptions(screen.getByLabelText('Seu estado'), 'PE');
    await user.type(screen.getByLabelText('Sua cidade'), 'Recife');
    resolve({ state: 'CE', city: 'Fortaleza' });
    expect(await screen.findByText(/Mantivemos o que você informou/)).toBeVisible();
    expect(screen.getByLabelText('Sua cidade')).toHaveValue('Recife');
    expect(screen.getByLabelText('Seu estado')).toHaveValue('PE');
  });
  it('permite preencher manualmente após falha de localização', async () => {
    const user = userEvent.setup();
    vi.mocked(detectLocation).mockRejectedValue(new Error('Localização não autorizada.'));
    render(<QuoteForm selectedProfile="family" selectionKey={0} />);
    await user.click(screen.getByRole('button', { name: 'Usar minha localização' }));
    expect(await screen.findByText('Localização não autorizada.')).toBeVisible();
    await user.selectOptions(screen.getByLabelText('Seu estado'), 'AM');
    await user.type(screen.getByLabelText('Sua cidade'), 'Manaus');
    expect(screen.getByLabelText('Sua cidade')).toHaveValue('Manaus');
  });
});
