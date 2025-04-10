import { Card, Col, Row, Avatar, Tag } from 'antd';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import styles from './ArticleCard.module.scss';

const Article = ({ article, isDetailPage }) => {
  const latestDate = new Date(article.updatedAt) > new Date(article.createdAt) ? article.updatedAt : article.createdAt;

  return (
    <Col span={24} key={article.slug}>
      <Card className={styles['article-card']}>
        <Row>
          <Col span={16}>
            <div className={styles['article-header']}>
              <Link to={`/articles/${article.slug}`}>
                <p className={styles['article-title']}>{article.title}</p>
              </Link>
            </div>
            <div className={styles['article-tags']}>
              {article.tagList &&
                article.tagList.length > 0 &&
                article.tagList
                  .filter((tag) => tag.trim() !== '')
                  .map((tag, index) => <Tag key={`${tag}-${index}`}>{tag}</Tag>)}
            </div>
            {isDetailPage ? (
              <>
                <p>{article.description}</p>
                <ReactMarkdown>{article.body}</ReactMarkdown>
              </>
            ) : (
              <p className={styles['article-description']}>{article.description}</p>
            )}
          </Col>

          <Col span={8}>
            <div className={styles['article-user']}>
              <div>
                <p className={styles['user-name']}>{article.author.username}</p>
                <p className={styles.date}>{format(new Date(latestDate), 'MMMM d, yyyy')}</p>
              </div>
              <Avatar size={64} src={article.author.image} alt={article.author.username} />
            </div>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default Article;
