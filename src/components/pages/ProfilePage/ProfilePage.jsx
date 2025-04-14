import { Card, Form, Input, Button, Spin, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery, useUpdateUserMutation } from '../../../api/articlesApi';
import { setUser, selectUser } from '../../../store/slices/userSlice';
import styles from './profilePage.module.scss';
import Loader from '../../Loader/Loader';

const { Title } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const { data: userData, error, isLoading } = useGetUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const user = useSelector(selectUser);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.user) {
      // Проверяем, есть ли данные пользователя
      dispatch(setUser(userData.user));
    }
  }, [userData, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    message.error('Failed to load user data');
    return null;
  }

  const initialValues = {
    username: user?.username || '',
    email: user?.email || '',
    image: user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };

  const onFinish = async (values) => {
    const updatedData = {
      email: values.email,
      username: values.username,
      image: values.image || null,
      ...(values.password && { password: values.password }),
    };

    try {
      const updatedUser = await updateUser(updatedData).unwrap();
      dispatch(setUser(updatedUser.user));
      message.success('Profile updated successfully!');
      navigate('/');
    } catch (error) {
      if (error?.data?.errors) {
        const serverErrors = Object.entries(error.data.errors).map(([field, message]) => ({
          name: field,
          errors: [message],
        }));
        form.setFields(serverErrors);
        message.error('There were some errors with your submission.');
      } else {
        message.error('Profile update failed.');
      }
    }
  };

  return (
    <div className={styles.profile}>
      <Card className={styles.profileCard}>
        <Title level={3} className="profile-title">
          Edit profile
        </Title>
        <Form
          form={form}
          name="profile"
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters long!' },
              { max: 20, message: 'Username must be no more than 20 characters long!' },
            ]}
            hasFeedback
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
            hasFeedback
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item
            label="New password"
            name="password"
            rules={[
              { min: 6, message: 'Password must be at least 6 characters long!' },
              { max: 40, message: 'Password must be no more than 40 characters long!' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="New password (optional)" />
          </Form.Item>

          <Form.Item
            label="Profile image (URL)"
            name="image"
            rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
            hasFeedback
          >
            <Input placeholder="Profile image URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isUpdating}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
