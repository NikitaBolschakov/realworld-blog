import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();

  // Функция для обработки клика на кнопку "Home"
  const handleClickToHome = () => { 
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <button className={styles.homeBtn} onClick={handleClickToHome}>
        <h2 className={styles.blog}>Realworld Blog</h2>
      </button>

      <div>
        <Link to={'/sign-in'}>
          <button className={styles.button}>Sign In</button>
        </Link>
        <Link to={'/sign-up'}>
          <button className={`${styles.button} ${styles.signUp}`}>Sign Up</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
