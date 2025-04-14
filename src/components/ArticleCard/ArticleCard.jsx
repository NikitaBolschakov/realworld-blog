import { useState, useEffect } from 'react';
import { Card, Col, Row, Avatar, Tag, Popconfirm, message } from 'antd';
import heart from '../../vendor/images/heart.svg';
import heartFull from '../../vendor/images/heart_full.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { useLikeArticleMutation, useDeleteArticleMutation, useGetArticlesQuery } from '../../api/articlesApi';
import styles from './ArticleCard.module.scss';

const ArticleCard = ({ article, isDetailPage }) => {
  const latestDate = new Date(article.updatedAt) > new Date(article.createdAt) ? article.updatedAt : article.createdAt; // Определяем, какая дата более поздняя
  const { user } = useSelector((state) => state.user); // Получаем пользователя из состояния Redux
  const token = user?.token; // Получаем токен из состояния
  const isLoggedIn = Boolean(token); // Проверяем, есть ли токен
  const navigate = useNavigate();
  const { refetch: refetchArticles } = useGetArticlesQuery({ limit: 5, offset: 0 }); // Получаем функцию для перезапроса статей

  const isAuthor = user?.username === article.author.username; // Проверяем, является ли текущий пользователь автором статьи

  const [likeArticle] = useLikeArticleMutation(); // Хук для лайка статьи
  const [deleteArticle] = useDeleteArticleMutation(); // Хук для удаления статьи
  const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount); // Состояние для количества лайков
  const [liked, setLiked] = useState(article.favorited); // Состояние для отслеживания лайка

  // Lля проверки лайка при загрузке
  useEffect(() => {
    if (article) {
      setLiked(article.favorited);
      setFavoritesCount(article.favoritesCount);
    }
  }, [article]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('Please log in to like articles!');
      return;
    }

    try {
      if (liked) {
        await likeArticle({ slug: article.slug, method: 'DELETE' }).unwrap();
        setFavoritesCount(favoritesCount - 1);
      } else {
        await likeArticle({ slug: article.slug, method: 'POST' }).unwrap();
        setFavoritesCount(favoritesCount + 1);
      }
      setLiked(!liked);
      console.log('Article like toggled successfully!');
    } catch (error) {
      console.error('Error toggling article like:', error);
      alert('Failed to toggle like on the article.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(article.slug).unwrap();
      message.success('Article deleted successfully');

      await refetchArticles();
      navigate('/articles');
    } catch (error) {
      message.error('Failed to delete article');
      console.error('Error deleting article:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/articles/${article.slug}/edit`);
  };

  return (
    <Col span={24} key={article.slug}>
      <Card className={styles.articleCard}>
        <Row>
          <Col span={16}>
            <div className={styles.articleHeader}>
              <Link to={`/articles/${article.slug}`}>
                <p className={styles.articleTitle}>{article.title}</p>
              </Link>
              <img
                onClick={isLoggedIn ? handleLike : null}
                src={liked ? heartFull : heart}
                alt="likes"
                className={styles.like}
                style={{
                  transform: isLoggedIn ? 'scale(1.1)' : 'none',
                  opacity: isLoggedIn ? 1 : 0.3,
                  cursor: isLoggedIn ? 'pointer' : 'default',
                }}
              />
              <span className={styles.likeNum}>{favoritesCount}</span>
            </div>
            <div className={styles.articleTags}>
              {article.tagList &&
                article.tagList.length > 0 &&
                article.tagList
                  .filter((tag) => tag.trim() !== '')
                  .map((tag, index) => <Tag key={`${tag}-${index}`}>{tag}</Tag>)}
            </div>

            {isDetailPage ? (
              <>
                <p className={styles.articleDescription}>{article.description}</p>
                <ReactMarkdown>{article.body}</ReactMarkdown>
              </>
            ) : (
              <p>{article.description}</p>
            )}
          </Col>
          <Col span={8}>
            <div className={styles.articleUser}>
              <div>
                <p className={styles.userName}>{article.author.username}</p>
                <p className={styles.date}>{format(new Date(latestDate), 'MMMM d, yyyy')}</p>
              </div>
              <Avatar size={64} src={article.author.image} alt={article.author.username} />
            </div>

            {isDetailPage && isAuthor && (
              <div className={styles.buttons}>
                <button onClick={handleEdit} className={styles.edit}>
                  Edit
                </button>
                <Popconfirm
                  title="Are you sure you want to delete this article?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <button type="button" className={styles.delete}>
                    Delete
                  </button>
                </Popconfirm>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default ArticleCard;
