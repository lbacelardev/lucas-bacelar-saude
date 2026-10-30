import { ArrowUpRight } from 'lucide-react';
import { Brand } from './Brand';
import { PrivacyDialog } from './PrivacyDialog';
import { site } from '../config/site';
import styles from '../App.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        <Brand />
        <div>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            {site.instagramHandle} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <span>Atendimento em todo o Brasil.</span>
        </div>
      </div>
      <div className={`container ${styles.footerBottom}`}>
        <p>
          Consultor independente. Este não é o site institucional das operadoras. Hapvida e
          NotreDame Intermédica são marcas de seus respectivos titulares. Produtos, rede e condições
          sujeitos a confirmação.
        </p>
        <PrivacyDialog />
        <span>© {new Date().getFullYear()} Lucas Bacelar Saúde</span>
      </div>
    </footer>
  );
}
