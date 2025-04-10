import { useEffect } from 'react';
import { useGetArticleBySlugQuery } from '../../../api/articlesApi';
import { Alert, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import ArticleCard from '../../../features/articles/ArticleCard';
import styles from './ArticlePage.module.scss';

const ArticlePage = () => {
  const { slug } = useParams(); // Получаем slug из URL
  const { data, error, isLoading, refetch } = useGetArticleBySlugQuery(slug); // Используем хук для получения статьи по slug

  // Перезапускаем запрос при изменении slug
  useEffect(() => {  
    if (slug) {
      refetch();
    }
  }, [slug, refetch]);

  if (isLoading) return <Spin size="large" className={styles.loadingOverlay} />
  if (error) return <Alert message="Ошибка при загрузке статьи" type="error" />;

  return (
    <div className={styles.articlePage}>
      {data ? (
        <ArticleCard key={data.article.slug} article={data.article} isDetailPage={true} />
      ) : (
        <Alert message="Статья не найдена" type="error" />
      )}
    </div>
  );
};

export default ArticlePage;
