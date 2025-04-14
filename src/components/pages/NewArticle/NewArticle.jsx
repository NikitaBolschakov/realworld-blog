import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { useCreateArticleMutation, useGetArticlesQuery } from '../../../api/articlesApi';
import styles from './NewArticle.module.scss';

const { Title } = Typography;
const { TextArea } = Input;

const NewArticle = () => {
  const [tagList, setTags] = useState(['']); // Начальное состояние для тегов
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const { refetch: refetchArticles, isFetching } = useGetArticlesQuery({ limit: 5, offset: 0 });
  const navigate = useNavigate();

  // Функция для обработки отправки формы
  const onFinish = async (values) => {
    try {
      const { title, description, text } = values;
      const result = await createArticle({
        title,
        description,
        body: text,
        tagList,
      }).unwrap();
      console.log(result);
      message.success(`Article created successfully! Title: ${result.article.title}`);

      await refetchArticles();
      navigate(`/articles/${result.article.slug}`);
    } catch (error) {
      message.error('Failed to create article');
      console.error('Error:', error);
    }
  };

  // Функция для обработки ошибок при отправке формы
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Функция для обработки изменения тегов
  // Обновляет состояние тегов при изменении значения в поле ввода
  const handleTagChange = (index, value) => {
    const newTags = [...tagList];
    newTags[index] = value;
    setTags(newTags);
  };

  // Функция для добавления нового тега
  const addTag = () => {
    setTags([...tagList, '']);
  };

  // Функция для удаления тега по индексу
  const removeTag = (index) => {
    const newTags = tagList.filter((_, i) => i !== index);
    setTags(newTags);
  };

  return (
    <div className={styles.newArticle}>
      <Card className={styles.newArticleCard}>
        <Title level={3} className={styles.newArticleTitle}>
          Create New Article
        </Title>
        <Form name="new-article" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            label="Short Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input placeholder="Short Description" />
          </Form.Item>

          <Form.Item label="Text" name="text" rules={[{ required: true, message: 'Please input the article text!' }]}>
            <TextArea rows={4} placeholder="Article Text" />
          </Form.Item>

          <Form.Item label="Tags">
            {tagList.map((tag, index) => (
              <div key={index} className={styles.tagRow}>
                <Input
                  className={styles.newArticleTag}
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                />
                <Button danger onClick={() => removeTag(index)} disabled={tagList.length <= 1}>
                  Delete
                </Button>
              </div>
            ))}
            <Button className={styles.addTagBtn} color="primary" variant="outlined" onClick={addTag}>
              Add Tag
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isLoading || isFetching}>
              Create article
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewArticle;
