import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Typography, Spin } from 'antd';
import { useGetArticleBySlugQuery, useUpdateArticleMutation, useGetArticlesQuery } from '../../../api/articlesApi';
import styles from './EditArticlePage.module.scss';
import Loader from '../../Loader/Loader';

const { Title } = Typography;
const { TextArea } = Input;

const EditArticlePage = () => {
  const { slug } = useParams();
  const { data: articleData, error } = useGetArticleBySlugQuery(slug);
  const [updateArticle] = useUpdateArticleMutation();
  const { refetch: refetchArticles, isFetching } = useGetArticlesQuery({ limit: 5, offset: 0 });
  const [tagList, setTags] = useState(['']);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Автоматически заполняем форму данными статьи при загрузке
  useEffect(() => {
    if (articleData) {
      setTags(articleData.article.tagList);
      form.setFieldsValue({
        title: articleData.article.title,
        description: articleData.article.description,
        text: articleData.article.body,
      });
    }
  }, [articleData, form]);

  // Проверяем наличие ошибки при загрузке статьи
  useEffect(() => {
    if (error) {
      message.error('Failed to fetch article');
      navigate('/articles');
    }
  }, [error, navigate]);

  // Функция для обработки отправки формы
  const onFinish = async (values) => {
    try {
      const { title, description, text } = values;
      const result = await updateArticle({
        slug,
        articleData: {
          title,
          description,
          body: text,
          tagList: tagList.filter((tag) => tag.trim() !== ''),
        },
      }).unwrap();
      message.success(`Article updated successfully! Title: ${result.article.title}`);
      await refetchArticles();
      navigate('/articles');
    } catch (error) {
      message.error('Failed to update article');
      console.error('Error:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tagList];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tagList, '']);
  };

  const removeTag = (index) => {
    const newTags = tagList.filter((_, i) => i !== index);
    setTags(newTags);
  };

  if (!articleData) {
    return <Loader />;
  }

  return (
    <div className={styles.editArticle}>
      <Card className={styles.editArticleCard}>
        <Title level={3} className={styles.editArticleTitle}>
          Edit Article
        </Title>
        <Form
          form={form}
          name="edit-article"
          layout="vertical"
          initialValues={{
            title: articleData?.article.title,
            description: articleData?.article.description,
            text: articleData?.article.body,
            tags: tagList,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
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
                  className={styles.editArticleTag}
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                />
                <Button danger onClick={() => removeTag(index)} disabled={tagList.length <= 1}>
                  Delete
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={addTag}>
              Add Tag
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isFetching}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditArticlePage;
