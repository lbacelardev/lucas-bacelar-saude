import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('navegação móvel', () => {
  it('fecha com Escape e devolve o foco ao botão de abertura', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const navigation = screen.getByRole('navigation', { name: 'Navegação móvel' });
    const link = within(navigation).getByRole('link', { name: 'Solicitar cotação' });
    link.focus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
