import { Button, Checkbox, Divider, Form, Input, message, Typography } from 'antd';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const { Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Login submit:', values);
    message.success('Signed in successfully. API integration is ready to connect.');
    form.resetFields(['password']);
  };

  return (
    <AuthLayout
      mode="login"
      formTitle="Sign in"
      formIntro="Access your business partner network, track collaboration opportunities, and grow with confidence."
    >
      <Form
        form={form}
        layout="vertical"
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item
          label="Email address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address.' },
            { type: 'email', message: 'Please enter a valid email address.' },
          ]}
        >
          <Input size="large" placeholder="name@company.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password.' }]}
        >
          <Input.Password size="large" placeholder="Enter your password" />
        </Form.Item>

        <Form.Item className="auth-form-options" noStyle>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a href="#" className="auth-link" onClick={(event) => event.preventDefault()}>
            Forgot password?
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Sign In
          </Button>
        </Form.Item>

        <Divider orientation="center">New to Partner Match?</Divider>

        <Text type="secondary">Create an account to start building trusted business connections.</Text>

        <div className="auth-page-link">
          <Link to="/register">Create an account</Link>
        </div>
      </Form>
    </AuthLayout>
  );
}