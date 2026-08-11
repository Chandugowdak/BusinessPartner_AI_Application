import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Typography,
  Divider,
  message,
} from "antd";

import {
  ArrowRightOutlined,
  CheckCircleFilled,
  GlobalOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const { Option } = Select;

export default function RegisterPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Register submit:", values);

    message.success("Account created successfully!");

    form.resetFields(["password", "confirm", "agreement"]);
  };

  return (
    <div className="container-fluid px-0">
      <div className="row g-0 min-vh-100">
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <div className="col-lg-6 d-none d-lg-flex">
          <div
            className="w-100 d-flex flex-column justify-content-between p-5 text-white"
            style={{
              minHeight: "100vh",
              background:
                "linear-gradient(135deg, #0f172a 0%, #172554 50%, #1d4ed8 100%)",
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
                    background: "rgba(255,255,255,0.12)",
                  }}
                >
                  <TeamOutlined style={{ fontSize: 22 }} />
                </div>

                <span className="fw-bold fs-4">
                  Partner
                  <span className="text-info">Match</span>
                </span>
              </div>

              {/* Main Content */}
              <div style={{ maxWidth: 540 }}>
                <Text
                  style={{
                    color: "#93c5fd",
                    fontWeight: 600,
                    letterSpacing: "1px",
                  }}
                >
                  YOUR BUSINESS JOURNEY STARTS HERE
                </Text>

                <Title
                  level={1}
                  style={{
                    color: "#fff",
                    fontSize: "clamp(38px, 4vw, 56px)",
                    lineHeight: 1.1,
                    marginTop: 18,
                    marginBottom: 24,
                  }}
                >
                  Don't build
                  <br />
                  <span style={{ color: "#60a5fa" }}>alone.</span>
                </Title>

                <Text
                  style={{
                    color: "#cbd5e1",
                    fontSize: 17,
                    lineHeight: 1.7,
                  }}
                >
                  PartnerMatch helps entrepreneurs discover people with
                  complementary skills, ideas, resources, and business goals.
                </Text>

                {/* Features */}
                <div className="mt-5">
                  <div className="d-flex align-items-start mb-4">
                    <CheckCircleFilled
                      style={{
                        color: "#60a5fa",
                        fontSize: 20,
                        marginTop: 3,
                      }}
                    />

                    <div className="ms-3">
                      <div className="fw-semibold text-white">
                        Find complementary skills
                      </div>

                      <small className="text-secondary">
                        Connect with people who bring different strengths to
                        your business.
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-4">
                    <CheckCircleFilled
                      style={{
                        color: "#60a5fa",
                        fontSize: 20,
                        marginTop: 3,
                      }}
                    />

                    <div className="ms-3">
                      <div className="fw-semibold text-white">
                        Discover new opportunities
                      </div>

                      <small className="text-secondary">
                        Explore startups, projects and business collaboration
                        opportunities.
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <CheckCircleFilled
                      style={{
                        color: "#60a5fa",
                        fontSize: 20,
                        marginTop: 3,
                      }}
                    />

                    <div className="ms-3">
                      <div className="fw-semibold text-white">
                        Build meaningful connections
                      </div>

                      <small className="text-secondary">
                        Create a professional network based on shared goals.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              <Divider
                style={{
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              />

              <div className="row g-3">
                <div className="col-4">
                  <SafetyCertificateOutlined
                    style={{
                      fontSize: 22,
                      color: "#60a5fa",
                    }}
                  />

                  <div className="mt-2">
                    <div className="fw-semibold">Trusted</div>

                    <small className="text-secondary">
                      Professional network
                    </small>
                  </div>
                </div>

                <div className="col-4">
                  <RocketOutlined
                    style={{
                      fontSize: 22,
                      color: "#60a5fa",
                    }}
                  />

                  <div className="mt-2">
                    <div className="fw-semibold">Growth</div>

                    <small className="text-secondary">
                      Business opportunities
                    </small>
                  </div>
                </div>

                <div className="col-4">
                  <GlobalOutlined
                    style={{
                      fontSize: 22,
                      color: "#60a5fa",
                    }}
                  />

                  <div className="mt-2">
                    <div className="fw-semibold">Global</div>

                    <small className="text-secondary">Connect anywhere</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <div className="col-lg-6 col-12">
          <div
            className="d-flex align-items-center justify-content-center p-3 p-md-5"
            style={{
              minHeight: "100vh",
              background: "#f8fafc",
            }}
          >
            <div
              className="w-100"
              style={{
                maxWidth: 520,
              }}
            >
              {/* Mobile Logo */}
              <div className="d-flex d-lg-none align-items-center justify-content-center gap-2 mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 42,
                    height: 42,
                    background: "#2563eb",
                    color: "#fff",
                  }}
                >
                  <TeamOutlined style={{ fontSize: 21 }} />
                </div>

                <span className="fw-bold fs-4">
                  Partner
                  <span style={{ color: "#2563eb" }}>Match</span>
                </span>
              </div>

              {/* Registration Card */}
              <div
                className="bg-white rounded-4 p-4 p-md-5"
                style={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
                }}
              >
                {/* Header */}
                <div className="mb-4">
                  <Text
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                  >
                    JOIN PARTNERMATCH
                  </Text>

                  <Title
                    level={2}
                    style={{
                      marginTop: 8,
                      marginBottom: 8,
                      fontSize: 32,
                    }}
                  >
                    Create your account
                  </Title>

                  <Text type="secondary">
                    Tell us a little about yourself so we can help you find
                    better business matches.
                  </Text>
                </div>

                {/* Progress indicator */}
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 30,
                      height: 30,
                      background: "#2563eb",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    1
                  </div>

                  <div
                    className="flex-grow-1 mx-2"
                    style={{
                      height: 2,
                      background: "#dbeafe",
                    }}
                  />

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 30,
                      height: 30,
                      background: "#e2e8f0",
                      color: "#64748b",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    2
                  </div>

                  <div
                    className="flex-grow-1 mx-2"
                    style={{
                      height: 2,
                      background: "#e2e8f0",
                    }}
                  />

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 30,
                      height: 30,
                      background: "#e2e8f0",
                      color: "#64748b",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    3
                  </div>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  name="register"
                  onFinish={onFinish}
                  requiredMark={false}
                >
                  {/* ================= PERSONAL DETAILS ================= */}

                  <div className="mb-3">
                    <Text strong>Personal information</Text>

                    <div className="mt-3">
                      <div className="row">
                        {/* First Name */}
                        <div className="col-md-6">
                          <Form.Item
                            label="First name"
                            name="firstName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your first name.",
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="First name"
                              style={{
                                height: 46,
                                borderRadius: 9,
                              }}
                            />
                          </Form.Item>
                        </div>

                        {/* Last Name */}
                        <div className="col-md-6">
                          <Form.Item
                            label="Last name"
                            name="lastName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your last name.",
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Last name"
                              style={{
                                height: 46,
                                borderRadius: 9,
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>

                      {/* Email */}
                      <Form.Item
                        label="Email address"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your email address.",
                          },
                          {
                            type: "email",
                            message: "Please enter a valid email address.",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="you@example.com"
                          style={{
                            height: 46,
                            borderRadius: 9,
                          }}
                        />
                      </Form.Item>

                      {/* Location */}
                      <Form.Item
                        label="Location"
                        name="location"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your location.",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          prefix={<GlobalOutlined />}
                          placeholder="City, Country"
                          style={{
                            height: 46,
                            borderRadius: 9,
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <Divider />

                  {/* ================= BUSINESS DETAILS ================= */}

                  <div className="mb-3">
                    <Text strong>Business profile</Text>

                    <div className="mt-3">
                      {/* Role */}
                      <Form.Item
                        label="What describes you best?"
                        name="role"
                        rules={[
                          {
                            required: true,
                            message: "Please select your role.",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder="Select your role"
                          style={{
                            width: "100%",
                          }}
                        >
                          <Option value="entrepreneur">Entrepreneur</Option>

                          <Option value="founder">Startup Founder</Option>

                          <Option value="investor">Investor</Option>

                          <Option value="business-owner">Business Owner</Option>

                          <Option value="professional">Professional</Option>

                          <Option value="student">
                            Student / Aspiring Entrepreneur
                          </Option>
                        </Select>
                      </Form.Item>

                      <div className="row">
                        {/* Business Stage */}
                        <div className="col-md-6">
                          <Form.Item
                            label="Business stage"
                            name="businessStage"
                            rules={[
                              {
                                required: true,
                                message: "Please select a stage.",
                              },
                            ]}
                          >
                            <Select size="large" placeholder="Select stage">
                              <Option value="idea">Just an idea</Option>

                              <Option value="planning">Planning</Option>

                              <Option value="early">Early stage</Option>

                              <Option value="growing">Growing business</Option>

                              <Option value="established">Established</Option>
                            </Select>
                          </Form.Item>
                        </div>

                        {/* Industry */}
                        <div className="col-md-6">
                          <Form.Item
                            label="Industry"
                            name="industry"
                            rules={[
                              {
                                required: true,
                                message: "Please select an industry.",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              placeholder="Select industry"
                              showSearch
                            >
                              <Option value="technology">Technology</Option>

                              <Option value="ecommerce">E-commerce</Option>

                              <Option value="finance">Finance</Option>

                              <Option value="healthcare">Healthcare</Option>

                              <Option value="education">Education</Option>

                              <Option value="agriculture">Agriculture</Option>

                              <Option value="real-estate">Real Estate</Option>

                              <Option value="food">Food & Beverage</Option>

                              <Option value="other">Other</Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* ================= SECURITY ================= */}

                  <div className="mb-3">
                    <Text strong>Secure your account</Text>

                    <div className="mt-3">
                      {/* Password */}
                      <Form.Item
                        label="Password"
                        name="password"
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please create a password.",
                          },
                          {
                            min: 8,
                            message:
                              "Password must contain at least 8 characters.",
                          },
                        ]}
                      >
                        <Input.Password
                          size="large"
                          placeholder="Create a strong password"
                          style={{
                            height: 46,
                            borderRadius: 9,
                          }}
                        />
                      </Form.Item>

                      {/* Confirm Password */}
                      <Form.Item
                        label="Confirm password"
                        name="confirm"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your password.",
                          },

                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }

                              return Promise.reject(
                                new Error("The two passwords do not match."),
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          size="large"
                          placeholder="Confirm your password"
                          style={{
                            height: 46,
                            borderRadius: 9,
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Agreement */}
                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    className="mb-4"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "You must agree to the terms and conditions.",
                                ),
                              ),
                      },
                    ]}
                  >
                    <Checkbox>
                      I agree to the{" "}
                      <a href="#" onClick={(event) => event.preventDefault()}>
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" onClick={(event) => event.preventDefault()}>
                        Privacy Policy
                      </a>
                    </Checkbox>
                  </Form.Item>

                  {/* Create Account */}
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
                      Create my account
                    </Button>
                  </Form.Item>
                </Form>

                {/* Login */}
                <div className="text-center">
                  <Text type="secondary">
                    Already have a PartnerMatch account?
                  </Text>

                  <div className="mt-2">
                    <Link
                      to="/login"
                      style={{
                        color: "#2563eb",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Sign in to your account →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  © 2026 PartnerMatch · Connect. Collaborate. Grow.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
