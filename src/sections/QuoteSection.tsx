import type { RefObject } from 'react';
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import { QuoteForm } from '../features/quote/QuoteForm';
import { contactUrl } from '../features/quote/quote';
import type { Profile } from '../features/quote/quote';
import { site } from '../config/site';
import styles from '../App.module.css';

export function QuoteSection({
  quoteSection,
  profile,
  selectionKey,
}: {
  quoteSection: RefObject<HTMLElement | null>;
  profile: Profile;
  selectionKey: number;
}) {
  return (
    <section
      className={styles.quoteSection}
      id="cotacao"
      ref={quoteSection}
      tabIndex={-1}
      aria-labelledby="quote-title"
    >
      <div className={`container section ${styles.quoteLayout}`}>
        <div className={styles.quoteCopy}>
          <span className="eyebrow">SEU PRÓXIMO PASSO</span>
          <h2 id="quote-title">
            Vamos encontrar
            <br />
            um caminho para
            <br /> <em>o seu cuidado?</em>
          </h2>
          <p>
            Prepare seu pedido em poucos passos. Depois, confira o resumo e continue a conversa
            comigo pelo WhatsApp.
          </p>
          <ul>
            <li>
              <Check size={18} aria-hidden="true" /> Solicitação sem compromisso
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Atendimento direto com Lucas
            </li>
            <li>
              <Check size={18} aria-hidden="true" /> Você confirma antes de enviar
            </li>
          </ul>
          <div className={styles.quoteContact}>
            <MessageCircle size={23} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <small>Prefere conversar primeiro?</small>
              <a href={contactUrl} target="_blank" rel="noopener noreferrer">
                {site.whatsappDisplay} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className={styles.quoteFine}>
            A cotação depende de disponibilidade, perfil e condições do produto. O formulário não
            calcula preços e não realiza contratação.
          </p>
        </div>
        <QuoteForm selectedProfile={profile} selectionKey={selectionKey} />
      </div>
    </section>
  );
}
