import { useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginUserMutation } from '../../../api/articlesApi';
import { setUser, selectUser } from '../../../store/slices/userSlice';
import styles from './loginPage.module.scss';

const { Title, Text } = Typography;  
 
const LoginPage = () => {
  const dispatch = useDispatch(); 
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onFinish = async (values) => {
    try {
      const result = await loginUser(values).unwrap();
      message.success('Login successful!');
      dispatch(setUser(result.user));
      navigate('/');
    } catch (error) {
      const errorMessage = error?.data?.errors
        ? Object.entries(error.data.errors).map(([field, msg]) => `${field} ${msg}`)
        : ['Login failed!'];
      message.error(errorMessage);
    }
  };

  return (
    <div className={styles.login}>
      <Card className={styles.loginCard} >
        <Title level={3} className={styles.loginTitle}>
          Sign In
        </Title>
        <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
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
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isLoading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.registerLink}>
          <Text>Don`t have an account? </Text>
          <Link to="/sign-up">Sign Up</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;