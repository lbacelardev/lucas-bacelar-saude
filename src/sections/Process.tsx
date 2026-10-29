import { ArrowUpRight } from 'lucide-react';
import styles from '../App.module.css';

export function Process() {
  return (
    <section className={styles.processSection} id="como-funciona" aria-labelledby="process-title">
      <div className={`container section ${styles.processLayout}`}>
        <div>
          <span className="eyebrow">UM PASSO DE CADA VEZ</span>
          <h2 id="process-title">
            Menos dúvidas.
            <br />
            <em>Mais clareza.</em>
          </h2>
          <p className={styles.processIntro}>
            Você não precisa entender todos os termos para começar. Vamos conversar sobre eles.
          </p>
          <a href="#cotacao" className={styles.secondaryLink}>
            Preparar minha solicitação <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <ol className={styles.steps}>
          {[
            [
              'Conte o que você procura',
              'Sua cidade, quem fará parte do plano e as idades. Só o necessário para começar.',
            ],
            [
              'Entenda suas opções',
              'Converse sobre valores, rede de atendimento, carências e condições de cada produto.',
            ],
            [
              'Decida com orientação',
              'Compare as opções e tire suas dúvidas antes de seguir com a contratação.',
            ],
          ].map(([title, description], index) => (
            <li key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
