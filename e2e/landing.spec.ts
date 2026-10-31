import { expect, test } from '@playwright/test';

for (const width of [320, 360, 390, 700, 768, 800, 1024, 1440]) {
  test(`layout e navegação em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const measurements = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('form, input, select, button, h1, h2, header a')]
        .filter((element) => element.getClientRects().length)
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
        })
        .map((element) => element.tagName + ': ' + element.textContent?.slice(0, 50)),
    }));
    expect(measurements.content).toBeLessThanOrEqual(measurements.viewport);
    expect(measurements.overflow).toEqual([]);
    if (width <= 800) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.getByRole('navigation', { name: 'Navegação móvel' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
    } else {
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
    }
  });
}

test('pedido empresarial no celular, revisão e invalidação após editar', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: /Consultar opções para minha empresa/ }).click();
  await expect(page.getByLabel('Empresa / MEI', { exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Preparar meu pedido' }).click();
  await expect(page.getByText('Selecione o tipo de empresa.', { exact: true })).toBeVisible();
  await page.getByLabel('Como posso chamar você?').fill('Ana');
  await page.getByLabel('Seu estado').selectOption('SP');
  await page.getByLabel('Sua cidade', { exact: true }).fill('São Paulo');
  await page.getByLabel('Pessoa 1', { exact: true }).fill('32');
  await page.getByRole('button', { name: 'Adicionar pessoa' }).click();
  await page.getByLabel('Pessoa 2', { exact: true }).fill('0');
  for (const [code, label] of [
    ['mei', 'MEI'],
    ['caepf', 'CAEPF'],
    ['cnpj', 'Outra empresa com CNPJ'],
    ['other', 'Outros tipos de empresa'],
  ]) {
    await page.getByLabel('Tipo de empresa').selectOption(code);
    await page.getByRole('button', { name: 'Preparar meu pedido' }).click();
    const href = await page
      .getByRole('link', { name: 'Continuar no WhatsApp' })
      .getAttribute('href');
    const url = new URL(href!);
    expect(url.origin + url.pathname).toBe('https://wa.me/5585998377953');
    expect(url.searchParams.get('text')).toContain(`Empresa: ${label}`);
    expect(url.searchParams.get('text')).toContain('São Paulo / SP');
    expect(url.searchParams.get('text')).toContain('32 anos, 0 anos');
  }
  await page.getByLabel('Sua cidade', { exact: true }).fill('Santos');
  await expect(page.getByRole('link', { name: 'Continuar no WhatsApp' })).toHaveCount(0);
});

test('privacidade abre, mantém foco no diálogo e fecha por Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Privacidade e uso dos dados' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
