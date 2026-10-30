import { ArrowDown, ArrowUpRight, Check, Heart, MapPin, ShieldCheck } from 'lucide-react';
import styles from '../App.module.css';

export function Hero() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <span className={styles.location}>
          <span /> CONSULTORIA DE PLANOS DE SAÚDE · TODO O BRASIL
        </span>
        <h1 id="hero-title">
          Seu próximo plano
          <br />
          começa com uma
          <br />
          <em>boa conversa.</em>
        </h1>
        <p>
          Escolher fica mais simples quando você entende as opções. Eu ajudo você a comparar planos
          de saúde para o seu momento de vida.
        </p>
        <div className={styles.heroActions}>
          <a className="button" href="#cotacao">
            Quero encontrar meu plano <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <a className={styles.secondaryLink} href="#como-funciona">
            Como funciona <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.heroNote}>
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Orientação pessoal. Sem compromisso de contratação.</span>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.visualTop}>
          <span>UM PLANO PARA CADA MOMENTO</span>
          <span className={styles.smallMark} aria-hidden="true">
            lb<span>•</span>
          </span>
        </div>
        <div className={styles.art} aria-hidden="true">
          <div className={styles.orbitOne} />
          <div className={styles.orbitTwo} />
          <span className={styles.artPlus}>+</span>
          <Heart className={styles.artHeart} strokeWidth={0.8} />
          <span className={styles.artDot} />
          <span className={styles.artCaption}>cuidar é estar perto.</span>
        </div>
        <div className={styles.visualBottom}>
          <span>O QUE IMPORTA PARA VOCÊ?</span>
          <p>
            Mais clareza na escolha.
            <br />
            <em>Mais cuidado no caminho.</em>
          </p>
          <div className={styles.visualTags}>
            <span>
              <Check size={13} aria-hidden="true" /> Você e sua família
            </span>
            <span>
              <Check size={13} aria-hidden="true" /> Sua empresa
            </span>
          </div>
        </div>
        <div className={styles.locationBadge}>
          <MapPin size={15} aria-hidden="true" /> Atendimento nacional
        </div>
      </div>
    </section>
  );
}
