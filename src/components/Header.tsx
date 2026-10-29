import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand } from './Brand';
import styles from '../App.module.css';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={styles.header} id="inicio">
      <div className={`container ${styles.headerInner}`}>
        <Brand />
        <nav className={styles.desktopNav} aria-label="Navegação principal">
          <a href="#planos">Para quem é</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#sobre">Seu consultor</a>
        </nav>
        <a className={`button button-outline ${styles.headerCta}`} href="#cotacao">
          Vamos conversar <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button
          className={`icon-button ${styles.menuButton}`}
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" className={styles.mobileNav} aria-label="Navegação móvel">
          <a href="#planos" onClick={() => setMenuOpen(false)}>
            Para quem é
          </a>
          <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
            Como funciona
          </a>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>
            Seu consultor
          </a>
          <a href="#cotacao" onClick={() => setMenuOpen(false)}>
            Solicitar cotação
          </a>
        </nav>
      )}
    </header>
  );
}
