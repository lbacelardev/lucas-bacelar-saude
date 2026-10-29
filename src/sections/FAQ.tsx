import { ChevronDown } from 'lucide-react';
import { faqs } from '../config/content';
import styles from '../App.module.css';

export function FAQ() {
  return (
    <section className={`container section ${styles.faq}`} id="duvidas" aria-labelledby="faq-title">
      <div>
        <span className="eyebrow">ANTES DE ESCOLHER</span>
        <h2 id="faq-title">Pode perguntar.</h2>
        <p>
          Informação clara também
          <br />
          faz parte do cuidado.
        </p>
      </div>
      <div className={styles.faqList}>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
