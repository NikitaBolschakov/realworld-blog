import { useCreateUserMutation } from '../../../api/articlesApi';
import { Card, Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/slices/userSlice';
import styles from './RegisterPage.module.scss';

const { Title, Text } = Typography;

const Register = () => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { username, email, password } = values;
      const result = await createUser({ username, email, password }).unwrap();
      message.success('Registration successful!');
      dispatch(setUser(result.user));
      navigate('/');
    } catch (error) {
      if (error?.data?.errors) {
        const formattedErrors = Object.entries(error.data.errors).map(([field, message]) => ({
          name: field,
          errors: [message],
        }));

        form.setFields(formattedErrors);
      } else {
        message.error('Registration failed!');
      }
      console.error('Error:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.register}>
      <Card className={styles.registerCard}>
        <Title level={3} className={styles.registerTitle}>
          Create new account
        </Title>
        <Form form={form} name="register" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters long!' },
              { max: 20, message: 'Username must be no more than 20 characters long!' },
            ]}
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
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' },
              { max: 40, message: 'Password must be no more than 40 characters long!' },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms')),
              },
            ]}
          >
            <Checkbox>I agree to the processing of my personal information</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={isLoading}>
              Create
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.loginLink}>
          <Text>Already have an account? </Text>
          <Link to="/sign-in">Sign In</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
