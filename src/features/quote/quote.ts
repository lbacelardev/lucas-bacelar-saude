import { z } from 'zod';
import { site } from '../../config/site';

export const quoteSchema = z
  .object({
    name: z.string().trim().min(2, 'Informe seu nome.').max(60, 'Use até 60 caracteres.'),
    city: z.string().trim().min(2, 'Informe sua cidade.').max(80, 'Use até 80 caracteres.'),
    profile: z.enum(['family', 'business']),
    companyType: z.enum(['', 'mei', 'cnpj']),
    people: z
      .array(
        z.object({
          age: z
            .string()
            .regex(/^\d{1,3}$/, 'Informe uma idade inteira, de 0 a 120 anos.')
            .refine((age) => Number(age) <= 120, 'Informe uma idade de até 120 anos.'),
        }),
      )
      .min(1, 'Inclua ao menos uma pessoa.')
      .max(20, 'Para mais de 20 pessoas, fale diretamente pelo WhatsApp.'),
  })
  .superRefine((data, context) => {
    if (data.profile === 'business' && !data.companyType) {
      context.addIssue({
        code: 'custom',
        path: ['companyType'],
        message: 'Selecione o tipo de empresa.',
      });
    }
  });

export type QuoteValues = z.infer<typeof quoteSchema>;
export type Profile = QuoteValues['profile'];

export function buildQuoteMessage(values: QuoteValues): string {
  const data = quoteSchema.parse(values);
  return [
    'Olá, Lucas! Gostaria de uma cotação de plano de saúde.',
    `Nome: ${data.name}`,
    `Cidade: ${data.city} / ${site.state}`,
    `Perfil: ${data.profile === 'business' ? 'Empresa / MEI' : 'Pessoa / família'}`,
    ...(data.profile === 'business'
      ? [`Empresa: ${data.companyType === 'mei' ? 'MEI' : 'Outra empresa com CNPJ'}`]
      : []),
    `Pessoas: ${data.people.length}`,
    `Idades: ${data.people.map(({ age }) => `${Number(age)} ${Number(age) === 1 ? 'ano' : 'anos'}`).join(', ')}`,
    'Quero confirmar as opções, a rede, os valores e as condições para minha região.',
  ].join('\n');
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const contactUrl = whatsappUrl('Olá, Lucas! Gostaria de orientação sobre planos de saúde.');
