import { useState } from 'react';
import { Pagination, Alert, Spin } from 'antd';
import { useGetArticlesQuery } from '../../../api/articlesApi'; // Импортируем хук для получения статей
import ArticleCard from '../../../features/articles/ArticleCard';
import styles from './ArticlesListPage.module.scss';

export default function ArticlesListPage() {
  const [currentPage, setCurrentPage] = useState(1); // Состояние для текущей страницы пагинации
  const limit = 5; // Количество статей на странице
  
  const { data, isLoading, isError, isFetching } = useGetArticlesQuery({
    limit, // Параметры для запроса: лимит статей на странице
    offset: (currentPage - 1) * limit  // Параметры для запроса: лимит и смещение (offset) для пагинации
  }); // Запрос на получение статей с использованием RTK Query

  // Функция для обработки изменения страницы
  const handlePageChange = (page) => {
    if (!isLoading && !isFetching) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return (
    <div className={styles.loadingOverlay}>
      <Spin size="large" />
    </div>
  );

  if (isError) return (
    <div className={styles.articlesList}>
      <Alert 
        message="Ошибка при загрузке статей" 
        type="error" 
        style={{ margin: '40px auto', maxWidth: '800px' }}
      />
    </div>
  );

  return (
    <div className={styles.articlesList}>
      <div className={styles.articlesGrid}>
        {data?.articles?.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      
      <div className={styles.paginationContainer}>
        <Pagination
          current={currentPage}
          pageSize={limit}
          total={data?.articlesCount || 0}
          onChange={handlePageChange}
          showSizeChanger={false}
          disabled={isFetching}
          hideOnSinglePage={true}
        />
      </div>
        {/* {data?.articles?.map((article) => (
        <ArticleCard key={article.slug} article={article} isDetailPage={false} />
      ))}

      <Pagination
        current={currentPage}
        pageSize={limit}
        total={data.articlesCount}
        onChange={handlePageChange}
        showSizeChanger={false} // Скрывает возможность изменения количества статей на странице
        disabled={isFetching} // Блокирует пагинацию во время загрузки данных
        style={{ marginTop: 20, textAlign: 'center' }}
      /> */}
    </div>
  );
}

/* import { useState } from 'react';
import { Pagination, Alert, Spin } from 'antd';
import { useGetArticlesQuery } from '../api/articlesApi';
import ArticleCard from '../features/articles/ArticleCard';
import styles from './ArticlesListPage.module.scss';

export default function ArticlesListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Количество статей на странице
  
  const { data, isLoading, isError, isFetching } = useGetArticlesQuery({
    limit,
    offset: (currentPage - 1) * limit
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return (
    <div className={styles.loadingOverlay}>
      <Spin size="large" />
    </div>
  );

  if (isError) return (
    <div className={styles.articlesList}>
      <Alert 
        message="Ошибка при загрузке статей" 
        type="error" 
        style={{ margin: '40px auto', maxWidth: '800px' }}
      />
    </div>
  );

  return (
    <div className={styles.articlesList}>
      <div className={styles.header}>
        <h1>Последние статьи</h1>
      </div>
      
      <div className={styles.articlesGrid}>
        {data?.articles?.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      
      <div className={styles.paginationContainer}>
        <Pagination
          current={currentPage}
          pageSize={limit}
          total={data?.articlesCount || 0}
          onChange={handlePageChange}
          showSizeChanger={false}
          disabled={isFetching}
          hideOnSinglePage={true}
        />
      </div>
    </div>
  );
} */
