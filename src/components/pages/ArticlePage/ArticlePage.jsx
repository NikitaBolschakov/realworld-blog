import { useParams } from 'react-router-dom'; // Импортируем хук useParams для получения параметров из URL
import { useGetArticleBySlugQuery } from '../../../api/articlesApi';
import { Avatar, Typography, Divider, Button, Skeleton, Tag, Space } from 'antd';
import { LeftOutlined, CalendarOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import styles from './ArticlePage.module.scss';

const { Title, Text, Paragraph } = Typography;

export default function ArticlePage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetArticleBySlugQuery(slug);

  if (isLoading) return (
    <div className={styles.container}>
      <Skeleton active paragraph={{ rows: 10 }} />
    </div>
  );

  if (isError) return (
    <div className={styles.container}>
      <div className={styles.error}>Ошибка загрузки статьи</div>
    </div>
  );

  const article = data?.article;

  return (
    <div className={styles.container}>
      <Button 
        type="link" 
        icon={<LeftOutlined />} 
        onClick={() => window.history.back()}
        className={styles.backButton}
      >
        Назад к статьям
      </Button>

      <div className={styles.header}>
        <Title level={1} className={styles.title}>{article?.title}</Title>
        
        <div className={styles.meta}>
          <Space size="middle">
            <Avatar src={article?.author?.image} size={48} />
            <div>
              <Text strong className={styles.author}>{article?.author?.username}</Text>
              <div className={styles.date}>
                <CalendarOutlined /> {new Date(article?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Space>

          <Space size="middle" className={styles.stats}>
            <Text><EyeOutlined /> {article?.views || 0}</Text>
            <Text><LikeOutlined /> {article?.favoritesCount || 0}</Text>
          </Space>
        </div>

        {article?.tagList?.length > 0 && (
          <div className={styles.tags}>
            {article.tagList.map(tag => (
              <Tag key={tag} className={styles.tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>

      <Divider className={styles.divider} />

      <div className={styles.content}>
        <ReactMarkdown components={{
          p: ({node, ...props}) => <Paragraph {...props} className={styles.paragraph} />,
          h2: ({node, ...props}) => <Title level={2} {...props} className={styles.heading} />,
          h3: ({node, ...props}) => <Title level={3} {...props} className={styles.heading} />,
          ul: ({node, ...props}) => <ul {...props} className={styles.list} />,
          ol: ({node, ...props}) => <ol {...props} className={styles.list} />,
          blockquote: ({node, ...props}) => (
            <blockquote {...props} className={styles.blockquote} />
          ),
          code: ({node, ...props}) => (
            <code {...props} className={styles.code} />
          ),
        }}>
          {article?.body}
        </ReactMarkdown>
      </div>
    </div>
  );
}