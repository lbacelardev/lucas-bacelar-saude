import { ArrowUpRight, Camera, MessageCircle } from 'lucide-react';
import { contactUrl } from '../features/quote/quote';
import { site } from '../config/site';
import styles from '../App.module.css';

export function About() {
  return (
    <section
      className={`container section ${styles.about}`}
      id="sobre"
      aria-labelledby="about-title"
    >
      <div className={styles.identityCard}>
        <span className={styles.identityMark} aria-hidden="true">
          lb<span>•</span>
        </span>
        <span className="eyebrow">PRAZER, SEU CONSULTOR.</span>
        <p>Lucas Bacelar</p>
        <span>PLANOS DE SAÚDE · TODO O BRASIL</span>
      </div>
      <div>
        <span className="eyebrow">ATENDIMENTO DE PESSOA PARA PESSOA</span>
        <h2 id="about-title">
          Uma escolha importante
          <br />
          merece <em>uma conversa.</em>
        </h2>
        <p>
          Sou Lucas Bacelar. Meu trabalho é ajudar você a entender as opções de planos de saúde e
          conferir as condições que fazem diferença na sua escolha.
        </p>
        <p>
          O atendimento é para todo o Brasil, com orientação para pessoas, famílias e empresas. Você
          fala diretamente comigo, do primeiro contato às dúvidas sobre a proposta.
        </p>
        <div className={styles.aboutLinks}>
          <a href={contactUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" /> Falar com Lucas{' '}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            <Camera size={18} aria-hidden="true" /> Instagram{' '}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
