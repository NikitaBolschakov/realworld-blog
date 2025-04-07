import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Realworld</h1>
    </header>
  );
}

export default Header;
