import { Button, Card, Checkbox, Form, Input, message, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AuthPage.css';

const { Title, Text } = Typography;

const slideConfig = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue building partnerships, discovering opportunities, and connecting with trusted business collaborators.',
    ctaText: 'Create account',
    ctaLink: '/register',
    panelLabel: 'Not a member yet?'
  },
  register: {
    title: 'Create your account',
    subtitle: 'Join Partner Match to find complementary business partners, pitch collaborations, and grow your network with confidence.',
    ctaText: 'Sign in',
    ctaLink: '/login',
    panelLabel: 'Already have an account?'
  }
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname === '/register' ? 'register' : 'login';
  const [active, setActive] = useState(mode);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const config = useMemo(() => slideConfig[active], [active]);

  useEffect(() => {
    if (mode !== active) {
      setActive(mode);
    }
  }, [mode, active]);

  const onFinishLogin = (values) => {
    console.log('Login submit:', values);
    message.success('Signed in successfully. Ready for API integration.');
    loginForm.resetFields(['password']);
  };

  const onFinishRegister = (values) => {
    console.log('Register submit:', values);
    message.success('Account created. Ready for backend integration.');
    registerForm.resetFields();
    navigate('/login');
  };

  const switchMode = () => {
    const next = active === 'login' ? 'register' : 'login';
    setActive(next);
    navigate(next === 'login' ? '/login' : '/register');
  };

  return (
    <div className={`auth-shell auth-mode-${active}`}>
      <div className="auth-container">
        <Card className="auth-side-card" bordered={false}>
          <div className="auth-panel-content">
            <div className="brand-pill">Partner Match</div>
            <Title level={3}>{config.title}</Title>
            <Text type="secondary">{config.subtitle}</Text>
            <div className="auth-illustration" />
            <div className="auth-action-row">
              <Text>{config.panelLabel}</Text>
              <Button type="link" onClick={switchMode}>{config.ctaText}</Button>
            </div>
          </div>
        </Card>

        <Card className="auth-form-card" bordered={false}>
          {active === 'login' ? (
            <div className="auth-form-inner">
              <Title level={2}>Sign in</Title>
              <Text type="secondary">Log in to your Partner Match account and continue your network growth.</Text>
              <Form form={loginForm} layout="vertical" name="login" onFinish={onFinishLogin} className="auth-form">
                <Form.Item
                  label="Email address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address.' },
                    { type: 'email', message: 'Enter a valid email address.' },
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

                <div className="auth-form-row">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link to="#" className="auth-link" onClick={(event) => event.preventDefault()}>
                    Forgot password?
                  </Link>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          ) : (
            <div className="auth-form-inner">
              <Title level={2}>Create account</Title>
              <Text type="secondary">Start your Partner Match journey and connect with ideal business partners.</Text>
              <Form form={registerForm} layout="vertical" name="register" onFinish={onFinishRegister} className="auth-form">
                <div className="auth-name-row">
                  <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{ required: true, message: 'Please enter your first name.' }]}
                    className="auth-half-field"
                  >
                    <Input size="large" placeholder="First name" />
                  </Form.Item>

                  <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[{ required: true, message: 'Please enter your last name.' }]}
                    className="auth-half-field"
                  >
                    <Input size="large" placeholder="Last name" />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Email address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address.' },
                    { type: 'email', message: 'Enter a valid email address.' },
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
              </Form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
