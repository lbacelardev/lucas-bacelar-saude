import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuoteForm } from './QuoteForm';

describe('fluxo do formulário', () => {
  it('bloqueia campos vazios, gera pedido e invalida o link após edição', async () => {
    const user = userEvent.setup();
    render(<QuoteForm selectedProfile="family" selectionKey={0} />);
    await user.click(screen.getByRole('button', { name: /Preparar meu pedido/ }));
    expect(await screen.findByText('Informe seu nome.')).toBeVisible();
    expect(screen.queryByRole('link', { name: /Continuar no WhatsApp/ })).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Como posso chamar você?'), 'Ana');
    await user.type(screen.getByLabelText('Pessoa 1'), '32');
    await user.click(screen.getByRole('button', { name: /Preparar meu pedido/ }));
    const link = await screen.findByRole('link', { name: /Continuar no WhatsApp/ });
    expect(new URL(link.getAttribute('href')!).searchParams.get('text')).toContain(
      'Idades: 32 anos',
    );
    await user.type(screen.getByLabelText('Pessoa 1'), '0');
    expect(screen.queryByRole('link', { name: /Continuar no WhatsApp/ })).not.toBeInTheDocument();
  });
  it('preserva ao menos uma pessoa e mantém as idades certas ao remover outra', async () => {
    const user = userEvent.setup();
    render(<QuoteForm selectedProfile="family" selectionKey={0} />);
    expect(screen.getByRole('button', { name: 'Remover pessoa 1' })).toBeDisabled();
    await user.type(screen.getByLabelText('Pessoa 1'), '40');
    await user.click(screen.getByRole('button', { name: /Adicionar pessoa/ }));
    await user.type(screen.getByLabelText('Pessoa 2'), '10');
    await user.click(screen.getByRole('button', { name: 'Remover pessoa 1' }));
    expect(screen.getByLabelText('Pessoa 1')).toHaveValue('10');
    expect(screen.getByRole('button', { name: 'Remover pessoa 1' })).toBeDisabled();
  });
  it('informa alternativa manual quando a área de transferência falha', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Bloqueado'));
    render(<QuoteForm selectedProfile="business" selectionKey={0} />);
    await user.selectOptions(screen.getByLabelText('Tipo de empresa'), 'mei');
    await user.type(screen.getByLabelText('Como posso chamar você?'), 'Ana');
    await user.type(screen.getByLabelText('Pessoa 1'), '32');
    await user.click(screen.getByRole('button', { name: /Preparar meu pedido/ }));
    await user.click(await screen.findByRole('button', { name: /Copiar pedido/ }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('copie manualmente'));
  });
});
