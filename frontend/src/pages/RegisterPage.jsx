import { useState } from "react";
import { App as AntApp, Button, Checkbox, Form, Input } from "antd";
import { ArrowRightOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { registerUser } from "../DataProvider/AuthDataProvider";
import "./RegisterForm.css";

/**
 * RegisterForm
 * Pure form component — no page layout, no branding panel.
 * Kept intentionally minimal: name, email, password. Add more
 * profile fields later once the core flow is in place.
 *
 * Props:
 *  - onSwitchToLogin: () => void   fired when the user taps "Sign in"
 */
export default function RegisterForm({ onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification } = AntApp.useApp();

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirm,
      });

      notification.success({
        message: "Registration successful",
        description: response?.message || "Your account has been created.",
      });
      form.resetFields(["name", "email", "password", "confirm", "agreement"]);
      onSwitchToLogin?.();
    } catch (error) {
      notification.error({
        message: "Registration failed",
        description: error?.response?.data?.message || "Please check your details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="register"
      className="register-form"
      onFinish={onFinish}
      requiredMark={false}
      autoComplete="off"
    >
      <Form.Item
        label={<span className="register-form-label">Full name</span>}
        name="name"
        rules={[{ required: true, message: "Please enter your full name." }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="register-form-icon" />}
          placeholder="Your full name"
          className="register-form-input"
        />
      </Form.Item>

      <Form.Item
        label={<span className="register-form-label">Email address</span>}
        name="email"
        rules={[
          { required: true, message: "Please enter your email address." },
          { type: "email", message: "Please enter a valid email address." },
        ]}
      >
        <Input
          size="large"
          prefix={<MailOutlined className="register-form-icon" />}
          placeholder="you@example.com"
          className="register-form-input"
        />
      </Form.Item>

      <Form.Item
        label={<span className="register-form-label">Password</span>}
        name="password"
        hasFeedback
        rules={[
          { required: true, message: "Please create a password." },
          { min: 8, message: "Password must contain at least 8 characters." },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="register-form-icon" />}
          placeholder="Create a strong password"
          className="register-form-input"
        />
      </Form.Item>

      <Form.Item
        label={<span className="register-form-label">Confirm password</span>}
        name="confirm"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password." },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("The two passwords do not match."));
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="register-form-icon" />}
          placeholder="Confirm your password"
          className="register-form-input"
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        className="register-form-agreement-item"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error("You must agree to the terms and conditions.")),
          },
        ]}
      >
        <Checkbox className="register-form-agreement">
          I agree to the{" "}
          <Link to="/terms" className="register-form-inline-link">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="register-form-inline-link">
            Privacy Policy
          </Link>
        </Checkbox>
      </Form.Item>

      <Form.Item className="register-form-submit-item">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={isSubmitting}
          disabled={isSubmitting}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          className="register-form-submit"
        >
          Create my account
        </Button>
      </Form.Item>

      <div className="register-form-footer">
        <span className="register-form-footer-text">Already have a BizMatch account? </span>
        <Link
          to="/login"
          onClick={() => onSwitchToLogin?.()}
          className="register-form-footer-link"
        >
          Sign in →
        </Link>
      </div>
    </Form>
  );
}