import { Route, Routes } from 'react-router-dom';

import ArticlesListPage from './components/pages/ArticlesListPage/ArticlesListPage';
import ArticlePage from './components/pages/ArticlePage/ArticlePage';
import Header from './components/Header/Header.jsx';
import styles from './App.module.scss';

function App() {
  return (
    <>
      <Header className={styles.header}/> 
      <Routes>
        <Route path="/" element={<ArticlesListPage />} />
        <Route path="/articles" element={<ArticlesListPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
      </Routes>
    </>
  );
}

export default App;
