import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, selectUser } from '../../store/slices/userSlice';
import { useGetArticlesQuery } from '../../api/articlesApi';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Получаем пользователя из Redux store
  const { refetch: refetchArticles, isFetching } = useGetArticlesQuery({ limit: 5, offset: 0 });

  // Функция для обработки клика на кнопку "Home"
  const handleClickToHome = async () => {
    await refetchArticles(); // Обновляем статьи
    navigate('/');
  };

  // Функция для обработки клика на кнопку "Sign Out"
  const handleClickSignOut = () => {
    dispatch(clearUser()); // Очищаем пользователя из Redux store
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <button className={styles.homeBtn} onClick={handleClickToHome} disabled={isFetching}>
        <h2 className={styles.blog}>Realworld Blog</h2>
      </button>

      <div>
        {user ? (
          <div className={styles.profile}>
            <Link to="/new-article">
              <button className={`${styles.button} ${styles.createArticle}`}>Create article</button>
            </Link>
            <Link to={'/profile'}>
              <p className={styles.username}>{user.username}</p>
            </Link>
            <Link to={'/profile'}>
              {user.image && <img src={user.image} alt="User image" className={styles.image} />}
            </Link>
            <button className={`${styles.button} ${styles.logOut}`} onClick={handleClickSignOut}>
              Log Out
            </button>
          </div>
        ) : (
          <>
            <Link to={'/sign-in'}>
              <button className={styles.button}>Sign In</button>
            </Link>
            <Link to={'/sign-up'}>
              <button className={`${styles.button} ${styles.signUp}`}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
