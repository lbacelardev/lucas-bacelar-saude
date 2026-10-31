import { useRef, useState } from 'react';
import type { Profile } from './features/quote/quote';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { PlanProfiles } from './sections/PlanProfiles';
import { Process } from './sections/Process';
import { About } from './sections/About';
import { QuoteSection } from './sections/QuoteSection';
import { FAQ } from './sections/FAQ';
import { AnalyticsConsent } from './components/AnalyticsConsent';
import styles from './App.module.css';

export function App() {
  const [profile, setProfile] = useState<Profile>('family');
  const [selectionKey, setSelectionKey] = useState(0);
  const quoteSection = useRef<HTMLElement>(null);
  function chooseProfile(next: Profile) {
    setProfile(next);
    setSelectionKey((key) => key + 1);
    quoteSection.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    quoteSection.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <div className={styles.operatorStrip}>
          <div className={`container ${styles.operatorInner}`}>
            <span>OPÇÕES PARA CONSULTAR</span>
            <p>
              Hapvida <i aria-hidden="true">/</i> NotreDame Intermédica
            </p>
            <small>Disponibilidade e condições confirmadas no atendimento.</small>
          </div>
        </div>
        <PlanProfiles onSelect={chooseProfile} />
        <Process />
        <About />
        <QuoteSection quoteSection={quoteSection} profile={profile} selectionKey={selectionKey} />
        <FAQ />
      </main>
      <Footer />
      <AnalyticsConsent />
    </>
  );
}
