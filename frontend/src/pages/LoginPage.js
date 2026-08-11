import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  Typography,
} from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  TeamOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Login submit:', values);

    message.success('Welcome back!');

    form.resetFields(['password']);
  };

  return (
   
      <div className="container-fluid px-0">
        <div className="row g-0 align-items-center min-vh-100">

          {/* ================= LEFT SIDE ================= */}
          <div className="col-lg-6 d-none d-lg-flex">
            <div
              className="w-100 d-flex flex-column justify-content-between p-5 text-white"
              style={{
                minHeight: '100vh',
                background:
                  'linear-gradient(135deg, #0f172a 0%, #172554 50%, #1d4ed8 100%)',
              }}
            >
              {/* Logo */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-5">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <TeamOutlined style={{ fontSize: 22 }} />
                  </div>

                  <span className="fw-bold fs-4">
                    Partner<span className="text-info">Match</span>
                  </span>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: 540 }}>
                  <Text
                    style={{
                      color: '#93c5fd',
                      fontWeight: 600,
                      letterSpacing: '1px',
                    }}
                  >
                    BUILD • CONNECT • GROW
                  </Text>

                  <Title
                    level={1}
                    style={{
                      color: '#fff',
                      fontSize: 'clamp(38px, 4vw, 58px)',
                      lineHeight: 1.1,
                      marginTop: 18,
                      marginBottom: 24,
                    }}
                  >
                    Find the right
                    <br />
                    <span style={{ color: '#60a5fa' }}>
                      business partner.
                    </span>
                  </Title>

                  <Text
                    style={{
                      color: '#cbd5e1',
                      fontSize: 17,
                      lineHeight: 1.7,
                    }}
                  >
                    Connect with entrepreneurs, founders, investors,
                    and professionals who share your vision and are
                    ready to build something meaningful together.
                  </Text>

                  {/* Benefits */}
                  <div className="mt-5">

                    <div className="d-flex align-items-center mb-4">
                      <CheckCircleFilled
                        style={{
                          color: '#60a5fa',
                          fontSize: 20,
                        }}
                      />

                      <span className="ms-3 text-light">
                        Find partners based on skills and interests
                      </span>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <CheckCircleFilled
                        style={{
                          color: '#60a5fa',
                          fontSize: 20,
                        }}
                      />

                      <span className="ms-3 text-light">
                        Discover opportunities in your location
                      </span>
                    </div>

                    <div className="d-flex align-items-center">
                      <CheckCircleFilled
                        style={{
                          color: '#60a5fa',
                          fontSize: 20,
                        }}
                      />

                      <span className="ms-3 text-light">
                        Build trusted professional connections
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Bottom Trust Section */}
              <div>
                <Divider
                  style={{
                    borderColor: 'rgba(255,255,255,0.15)',
                  }}
                />

                <div className="row g-3">

                  <div className="col-4">
                    <SafetyCertificateOutlined
                      style={{
                        fontSize: 22,
                        color: '#60a5fa',
                      }}
                    />

                    <div className="mt-2">
                      <div className="fw-semibold">Trusted</div>
                      <small className="text-secondary">
                        Connections
                      </small>
                    </div>
                  </div>

                  <div className="col-4">
                    <GlobalOutlined
                      style={{
                        fontSize: 22,
                        color: '#60a5fa',
                      }}
                    />

                    <div className="mt-2">
                      <div className="fw-semibold">Global</div>
                      <small className="text-secondary">
                        Opportunities
                      </small>
                    </div>
                  </div>

                  <div className="col-4">
                    <TeamOutlined
                      style={{
                        fontSize: 22,
                        color: '#60a5fa',
                      }}
                    />

                    <div className="mt-2">
                      <div className="fw-semibold">Growing</div>
                      <small className="text-secondary">
                        Community
                      </small>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="col-lg-6 col-12">
            <div
              className="d-flex align-items-center justify-content-center p-4 p-md-5"
              style={{
                minHeight: '100vh',
                background: '#f8fafc',
              }}
            >
              <div
                className="w-100"
                style={{
                  maxWidth: 460,
                }}
              >

                {/* Mobile Logo */}
                <div className="d-flex d-lg-none align-items-center justify-content-center gap-2 mb-5">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 42,
                      height: 42,
                      background: '#2563eb',
                      color: '#fff',
                    }}
                  >
                    <TeamOutlined style={{ fontSize: 21 }} />
                  </div>

                  <span className="fw-bold fs-4">
                    Partner<span style={{ color: '#2563eb' }}>Match</span>
                  </span>
                </div>

                {/* Login Card */}
                <div
                  className="bg-white rounded-4 p-4 p-md-5"
                  style={{
                    border: '1px solid #e2e8f0',
                    boxShadow:
                      '0 20px 50px rgba(15, 23, 42, 0.08)',
                  }}
                >

                  {/* Heading */}
                  <div className="mb-4">
                    <Text
                      style={{
                        color: '#2563eb',
                        fontWeight: 600,
                      }}
                    >
                      WELCOME BACK
                    </Text>

                    <Title
                      level={2}
                      style={{
                        marginTop: 8,
                        marginBottom: 8,
                        fontSize: 32,
                      }}
                    >
                      Sign in to your account
                    </Title>

                    <Text type="secondary">
                      Continue discovering the right people to
                      build your business with.
                    </Text>
                  </div>

                  {/* Form */}
                  <Form
                    form={form}
                    layout="vertical"
                    name="login"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                    requiredMark={false}
                  >

                    {/* Email */}
                    <Form.Item
                      label={
                        <span className="fw-semibold">
                          Email address
                        </span>
                      }
                      name="email"
                      rules={[
                        {
                          required: true,
                          message:
                            'Please enter your email address.',
                        },
                        {
                          type: 'email',
                          message:
                            'Please enter a valid email address.',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="you@example.com"
                        style={{
                          height: 48,
                          borderRadius: 10,
                        }}
                      />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                      label={
                        <span className="fw-semibold">
                          Password
                        </span>
                      }
                      name="password"
                      rules={[
                        {
                          required: true,
                          message:
                            'Please enter your password.',
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Enter your password"
                        style={{
                          height: 48,
                          borderRadius: 10,
                        }}
                      />
                    </Form.Item>

                    {/* Remember / Forgot */}
                    <div className="d-flex justify-content-between align-items-center mb-4">

                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>
                          Remember me
                        </Checkbox>
                      </Form.Item>

                      <Link
                        to="/forgot-password"
                        style={{
                          color: '#2563eb',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        Forgot password?
                      </Link>

                    </div>

                    {/* Login Button */}
                    <Form.Item className="mb-4">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        style={{
                          height: 50,
                          borderRadius: 10,
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                      >
                        Sign in
                      </Button>
                    </Form.Item>

                  </Form>

                  {/* Divider */}
                  <Divider plain>
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: 13,
                      }}
                    >
                      New to PartnerMatch?
                    </span>
                  </Divider>

                  {/* Register */}
                  <div className="text-center">

                    <Text type="secondary">
                      Start finding people who can help turn
                      your business idea into reality.
                    </Text>

                    <div className="mt-3">
                      <Link
                        to="/register"
                        className="fw-semibold"
                        style={{
                          color: '#2563eb',
                          textDecoration: 'none',
                        }}
                      >
                        Create your free account →
                      </Link>
                    </div>

                  </div>

                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                  <Text
                    type="secondary"
                    style={{ fontSize: 12 }}
                  >
                    © 2026 PartnerMatch · Built for entrepreneurs
                  </Text>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
  
  );
}