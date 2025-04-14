import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { useGetArticleBySlugQuery } from '../../api/articlesApi';

const PrivateRoute = ({ children, isAuthenticated, user }) => {
  const { slug } = useParams(); // Получаем slug из URL

  const { data: articleData, isLoading } = useGetArticleBySlugQuery(slug, {
    skip: !slug, // Пропускаем запрос, если slug отсутствует
  });

  // Проверяем, является ли текущий пользователь автором статьи
  const isAuthor = articleData?.article.author.username === user?.username;  

  // Проверяем, авторизован ли пользователь и загружены ли данные
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      message.warning('You need to be logged in to access this page.'); 
    } else if (isAuthenticated && articleData && !isAuthor) {
      message.error('You do not have permission to edit this article.');
    }
  }, [isAuthenticated, isAuthor, articleData, isLoading]);

  if (isLoading) {
    return <Spin size="large"/>
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  // Если пользователь не авторизован и данные статьи загружены, перенаправляем на страницу статей
  if (articleData && !isAuthor) {
    return <Navigate to="/articles" />;
  }

  return children;
};

export default PrivateRoute;