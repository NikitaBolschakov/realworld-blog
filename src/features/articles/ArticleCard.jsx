import { Link } from 'react-router-dom';
import styles from './ArticleCard.module.scss';

export default function ArticleCard({ article }) {
  return (
    <div className={styles.card}>
      <Link to={`/articles/${article.slug}`}>
        <h2>{article.title}</h2>
      </Link>
      <p>{article.description}</p>
      <span>Автор: {article.author.username}</span>
    </div>
  );
}