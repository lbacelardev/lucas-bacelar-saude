import { describe, expect, it } from 'vitest';
import { buildQuoteMessage, quoteSchema, whatsappUrl } from './quote';
import type { QuoteValues } from './quote';

const valid: QuoteValues = {
  name: '  Ana  ',
  city: 'Fortaleza',
  state: 'CE',
  profile: 'family',
  companyType: '',
  people: [{ age: '0' }, { age: '1' }, { age: '120' }],
};

describe('regras da solicitação', () => {
  it.each([
    ['mei', 'MEI'],
    ['caepf', 'CAEPF'],
    ['cnpj', 'Outra empresa com CNPJ'],
    ['other', 'Outros tipos de empresa'],
  ] as const)('inclui o tipo empresarial %s no pedido', (companyType, label) => {
    expect(buildQuoteMessage({ ...valid, profile: 'business', companyType })).toContain(
      `Empresa: ${label}`,
    );
  });
  it('usa a UF do visitante e rejeita estado vazio', () => {
    expect(buildQuoteMessage({ ...valid, city: 'São Paulo', state: 'SP' })).toContain(
      'São Paulo / SP',
    );
    expect(quoteSchema.safeParse({ ...valid, state: '' }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, state: 'XX' }).success).toBe(false);
  });
  it('aceita recém-nascidos e os limites de idade', () => {
    expect(quoteSchema.parse(valid).name).toBe('Ana');
    expect(buildQuoteMessage(valid)).toContain('Idades: 0 anos, 1 ano, 120 anos');
  });
  it.each(['', '-1', '121', '2.5', '1e2', 'abc'])('recusa idade inválida %s', (age) => {
    expect(quoteSchema.safeParse({ ...valid, people: [{ age }] }).success).toBe(false);
  });
  it('exige ao menos uma pessoa e permite até vinte', () => {
    expect(quoteSchema.safeParse({ ...valid, people: [] }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, people: Array(21).fill({ age: '20' }) }).success).toBe(
      false,
    );
  });
  it('exige tipo de empresa apenas para perfil empresarial', () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
    expect(quoteSchema.safeParse({ ...valid, profile: 'business' }).success).toBe(false);
    expect(buildQuoteMessage({ ...valid, profile: 'business', companyType: 'mei' })).toContain(
      'Empresa: MEI',
    );
  });
  it('não inclui tipo de empresa residual em pedido familiar', () => {
    expect(buildQuoteMessage({ ...valid, companyType: 'mei' })).not.toContain('Empresa:');
  });
  it('codifica acentos e caracteres especiais sem alterar o destinatário', () => {
    const message = buildQuoteMessage({ ...valid, name: 'João & Maria #1' });
    const url = new URL(whatsappUrl(message));
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/5585998377953');
    expect(url.searchParams.get('text')).toBe(message);
  });
});
