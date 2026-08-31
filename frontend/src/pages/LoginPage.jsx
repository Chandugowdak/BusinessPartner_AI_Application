import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { ArrowRightOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { loginUser } from "../DataProvider/AuthDataProvider";
import "./LoginForm.css";

/**
 * LoginForm
 * Pure form component — no page layout, no branding panel.
 * Meant to be rendered inside <AuthPage /> alongside <RegisterForm />.
 *
 * Props:
 *  - onSwitchToRegister: () => void   fired when the user taps "Create account"
 */
export default function LoginForm({ onSwitchToRegister }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await loginUser({
        email: values.email,
        password: values.password,
      });

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      message.success(response?.message || "Welcome back!");
      form.resetFields(["password"]);
    } catch (error) {
      message.error(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      requiredMark={false}
      autoComplete="off"
    >
      <Form.Item
        label={<span className="login-form-label">Email address</span>}
        name="email"
        rules={[
          { required: true, message: "Please enter your email address." },
          { type: "email", message: "Please enter a valid email address." },
        ]}
      >
        <Input
          size="large"
          prefix={<MailOutlined className="login-form-icon" />}
          placeholder="you@example.com"
          className="login-form-input"
        />
      </Form.Item>

      <Form.Item
        label={<span className="login-form-label">Password</span>}
        name="password"
        rules={[{ required: true, message: "Please enter your password." }]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="login-form-icon" />}
          placeholder="Enter your password"
          className="login-form-input"
        />
      </Form.Item>

      <div className="login-form-meta-row">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox className="login-form-remember">Remember me</Checkbox>
        </Form.Item>

        <Link to="/forgot-password" className="login-form-forgot">
          Forgot password?
        </Link>
      </div>

      <Form.Item className="login-form-submit-item">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isSubmitting}
          disabled={isSubmitting}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          className="login-form-submit"
        >
          Sign in
        </Button>
      </Form.Item>

      <div className="login-form-footer">
        <span className="login-form-footer-text">New to BizMatch? </span>
        <Link
          to="/register"
          onClick={() => onSwitchToRegister?.()}
          className="login-form-footer-link"
        >
          Create your free account →
        </Link>
      </div>
    </Form>
  );
}