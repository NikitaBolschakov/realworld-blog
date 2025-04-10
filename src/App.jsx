import { Route, Routes } from 'react-router-dom';

import ArticlesListPage from './components/pages/ArticleListPage/ArticlesListPage.jsx';
import ArticlePage from './components/pages/ArticlePage/ArticlePage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage.jsx';
import LoginPage from './components/pages/LoginPage/LoginPage.jsx';
import Header from './components/Header/Header.jsx';
import styles from './App.module.scss';
import { useGetArticlesQuery } from './api/articlesApi';

function App() {
  const { data } = useGetArticlesQuery({ limit: 5, offset: 0 });
  return (
    <>
      <Header className={styles.header} />
      <Routes>
        <Route path="/" element={<ArticlesListPage />} />
        <Route path="/articles" element={<ArticlesListPage />} />
        <Route path="/articles/:slug" element={<ArticlePage articles={data} />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
