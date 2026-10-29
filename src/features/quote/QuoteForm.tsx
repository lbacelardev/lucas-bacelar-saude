import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Check, Copy, Plus, Trash2 } from 'lucide-react';
import { buildQuoteMessage, quoteSchema, whatsappUrl } from './quote';
import type { Profile, QuoteValues } from './quote';
import styles from './QuoteForm.module.css';

type Props = { selectedProfile: Profile; selectionKey: number };

export function QuoteForm({ selectedProfile, selectionKey }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      city: 'Fortaleza',
      profile: selectedProfile,
      companyType: '',
      people: [{ age: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'people' });
  const values = useWatch({ control });
  const [result, setResult] = useState<{ message: string; snapshot: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const resultIsCurrent = result?.snapshot === JSON.stringify(values);

  useEffect(() => {
    setValue('profile', selectedProfile);
  }, [selectedProfile, selectionKey, setValue]);

  function onSubmit(data: QuoteValues) {
    setResult({ message: buildQuoteMessage(data), snapshot: JSON.stringify(values) });
    setCopyStatus('');
    requestAnimationFrame(() => resultHeading.current?.focus());
  }

  async function copyMessage(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus('Pedido copiado. Você pode colar na conversa.');
    } catch {
      setCopyStatus('Não foi possível copiar. Selecione o texto do pedido e copie manualmente.');
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <div className={styles.heading}>
        <span className="eyebrow">PRIMEIRO, SEU PERFIL</span>
        <h3>Vamos começar?</h3>
        <p>Sem CPF. Sem informações de saúde.</p>
      </div>
      <fieldset className={styles.fieldset}>
        <legend>Para quem é o plano?</legend>
        <div className={styles.profiles}>
          <label>
            <input {...register('profile')} type="radio" value="family" />
            <span>Pessoa / família</span>
          </label>
          <label>
            <input {...register('profile')} type="radio" value="business" />
            <span>Empresa / MEI</span>
          </label>
        </div>
      </fieldset>
      {values.profile === 'business' && (
        <div className={styles.field}>
          <label htmlFor="company-type">Tipo de empresa</label>
          <select
            id="company-type"
            {...register('companyType')}
            aria-invalid={!!errors.companyType}
            aria-describedby={errors.companyType ? 'company-error' : undefined}
          >
            <option value="">Selecione</option>
            <option value="mei">MEI</option>
            <option value="cnpj">Outra empresa com CNPJ</option>
          </select>
          {errors.companyType && (
            <p className={styles.error} id="company-error">
              {errors.companyType.message}
            </p>
          )}
        </div>
      )}
      <div className={styles.field}>
        <label htmlFor="client-name">Como posso chamar você?</label>
        <input
          id="client-name"
          {...register('name')}
          autoComplete="given-name"
          placeholder="Seu primeiro nome"
          maxLength={60}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p className={styles.error} id="name-error">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="city">Sua cidade no Ceará</label>
        <input
          id="city"
          {...register('city')}
          autoComplete="address-level2"
          maxLength={80}
          aria-invalid={!!errors.city}
          aria-describedby="city-note city-error"
        />
        <p className={styles.help} id="city-note">
          Atendimento inicial em Fortaleza. Outras cidades dependem de confirmação.
        </p>
        <p className={styles.error} id="city-error">
          {errors.city?.message}
        </p>
      </div>
      <fieldset className={styles.fieldset}>
        <legend>Idades de quem vai entrar no plano</legend>
        <p className={styles.help}>Inclua você, se também fizer parte do plano.</p>
        <div className={styles.people}>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className={styles.person}>
                <label htmlFor={`age-${field.id}`}>Pessoa {index + 1}</label>
                <div className={styles.age}>
                  <input
                    id={`age-${field.id}`}
                    {...register(`people.${index}.age`)}
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="Idade"
                    aria-invalid={!!errors.people?.[index]?.age}
                    aria-describedby={
                      errors.people?.[index]?.age ? `age-error-${field.id}` : undefined
                    }
                  />
                  <span>anos</span>
                </div>
                <button
                  className="icon-button"
                  type="button"
                  disabled={fields.length === 1}
                  aria-label={`Remover pessoa ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
              {errors.people?.[index]?.age && (
                <p id={`age-error-${field.id}`} className={styles.error}>
                  {errors.people[index]?.age?.message}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          className={styles.add}
          type="button"
          disabled={fields.length >= 20}
          onClick={() => append({ age: '' })}
        >
          <Plus size={16} aria-hidden="true" /> Adicionar pessoa
        </button>
        {fields.length >= 20 && (
          <p className={styles.help}>Para incluir mais pessoas, fale diretamente pelo WhatsApp.</p>
        )}
      </fieldset>
      <button className="button button-dark" type="submit">
        Preparar meu pedido <ArrowUpRight size={19} aria-hidden="true" />
      </button>
      <p className={styles.privacy}>
        Você revisa o pedido antes de abrir o WhatsApp. Nenhum dado é enviado automaticamente.
      </p>
      {result && resultIsCurrent && (
        <section className={styles.result} aria-labelledby="result-title">
          <span className={styles.ready}>
            <Check size={15} aria-hidden="true" /> PRONTO PARA REVISAR
          </span>
          <h4 id="result-title" ref={resultHeading} tabIndex={-1}>
            Seu pedido de cotação
          </h4>
          <p>Confira as informações. Preços e disponibilidade serão confirmados no atendimento.</p>
          <pre>{result.message}</pre>
          <a
            className="button button-dark"
            href={whatsappUrl(result.message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continuar no WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <button
            className={styles.copy}
            type="button"
            onClick={() => void copyMessage(result.message)}
          >
            <Copy size={16} aria-hidden="true" /> Copiar pedido
          </button>
          <p role="status">{copyStatus}</p>
          <p className={styles.privacy}>
            Ao continuar, o pedido será compartilhado com o WhatsApp. Você confirma o envio no
            aplicativo.
          </p>
        </section>
      )}
    </form>
  );
}
