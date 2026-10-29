import { ArrowUpRight, Building2, UsersRound } from 'lucide-react';
import type { Profile } from '../features/quote/quote';
import styles from '../App.module.css';

export function PlanProfiles({ onSelect }: { onSelect: (profile: Profile) => void }) {
  return (
    <section
      className={`container section ${styles.profilesSection}`}
      id="planos"
      aria-labelledby="profiles-title"
    >
      <div className={styles.sectionIntro}>
        <div>
          <span className="eyebrow">CADA FASE TEM SUAS PRIORIDADES</span>
          <h2 id="profiles-title">
            O cuidado que faz sentido
            <br />
            para <em>o seu momento.</em>
          </h2>
        </div>
        <p>
          O ponto de partida é entender quem precisa do plano. A partir daí, conversamos sobre as
          opções.
        </p>
      </div>
      <div className={styles.profileCards}>
        <button className={styles.profileCard} type="button" onClick={() => onSelect('family')}>
          <UsersRound size={30} strokeWidth={1.3} aria-hidden="true" />
          <span className={styles.cardNumber}>01 / PESSOA E FAMÍLIA</span>
          <h3>Para quem é seu mundo.</h3>
          <p>Uma escolha para você ou para compartilhar o cuidado com sua família.</p>
          <span className={styles.cardLink}>
            Consultar opções para minha família <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </button>
        <button className={styles.profileCard} type="button" onClick={() => onSelect('business')}>
          <Building2 size={30} strokeWidth={1.3} aria-hidden="true" />
          <span className={styles.cardNumber}>02 / EMPRESA E MEI</span>
          <h3>Para cuidar de quem faz.</h3>
          <p>
            Conheça as possibilidades para sócios e colaboradores, conforme os critérios do produto.
          </p>
          <span className={styles.cardLink}>
            Consultar opções para minha empresa <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>
  );
}
