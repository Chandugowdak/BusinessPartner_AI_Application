import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const { Text } = Typography;

export default function RegisterPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Register submit:', values);
    message.success('Account created. Ready for backend integration.');
    form.resetFields(['password', 'confirm', 'agreement']);
  };

  return (
    <AuthLayout
      mode="register"
      formTitle="Create account"
      formIntro="Join Partner Match to find complementary business partners, pitch collaborations, and grow your network."
    >
      <Form form={form} layout="vertical" name="register" onFinish={onFinish} requiredMark="optional">
        <Form.Item
          label="First name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name.' }]}
        >
          <Input size="large" placeholder="First name" />
        </Form.Item>

        <Form.Item
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name.' }]}
        >
          <Input size="large" placeholder="Last name" />
        </Form.Item>

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
          rules={[{ required: true, message: 'Please enter a password.' }]}
          hasFeedback
        >
          <Input.Password size="large" placeholder="Create a password" />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match.'));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Confirm password" />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('You must agree to the terms and conditions.')),
            },
          ]}
        >
          <Checkbox>
            I agree to the <a href="#" onClick={(event) => event.preventDefault()}>Terms & Conditions</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Create account
          </Button>
        </Form.Item>

        <Text type="secondary">Already have an account?</Text>
        <div className="auth-page-link">
          <Link to="/login">Sign in</Link>
        </div>
      </Form>
    </AuthLayout>
  );
}