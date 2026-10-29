import styles from './Brand.module.css';

export function Brand() {
  return (
    <a className={styles.brand} href="#inicio" aria-label="Lucas Bacelar Saúde, início">
      <span className={styles.mark} aria-hidden="true">
        lb<span>•</span>
      </span>
      <span>
        Lucas Bacelar<small>CONSULTORIA EM SAÚDE</small>
      </span>
    </a>
  );
}
