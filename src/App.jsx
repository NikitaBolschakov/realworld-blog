import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser } from './store/slices/userSlice';
import { useGetArticlesQuery } from './api/articlesApi';

import ArticlesListPage from './components/pages/ArticleListPage/ArticlesListPage.jsx';
import ArticlePage from './components/pages/ArticlePage/ArticlePage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage.jsx';
import LoginPage from './components/pages/LoginPage/LoginPage.jsx';
import ProfilePage from './components/pages/ProfilePage/ProfilePage.jsx';
import NewArticle from './components/pages/NewArticle/NewArticle.jsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import Header from './components/Header/Header.jsx';
import styles from './App.module.scss';

function App() {
  const dispatch = useDispatch();
  const { data } = useGetArticlesQuery({ limit: 5, offset: 0 });
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = !!user; // Проверяем, есть ли пользователь в состоянии

  // Инициализация пользователя при загрузке приложения
  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  return (
    <>
      <Header className={styles.header} />
      <Routes>
        <Route path="/" element={<ArticlesListPage />} />
        <Route path="/articles" element={<ArticlesListPage />} />
        <Route path="/articles/:slug" element={<ArticlePage articles={data} />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} user={user}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-article"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} user={user}>
              <NewArticle />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
