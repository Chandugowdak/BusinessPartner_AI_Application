import { useEffect, useState } from "react";
import { App as AntApp, Button, Checkbox, Form, Input, Select } from "antd";
import { ArrowRightOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { getAdminBootstrapStatus, registerUser } from "../DataProvider/AuthDataProvider";
import "./RegisterForm.css";

/**
 * RegisterForm
 * Pure form component — no page layout, no branding panel.
 * Kept intentionally minimal: name, email, password. Add more
 * profile fields later once the core flow is in place.
 *
 * Props:
 *  - onSwitchToLogin: () => void   called after successful registration
 *  - onOpenPolicy: () => void   opens the privacy and terms information
 */
export default function RegisterForm({ onSwitchToLogin, onOpenPolicy }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canRegisterAdmin, setCanRegisterAdmin] = useState(false);
  const [bootstrapStatusError, setBootstrapStatusError] = useState("");
  const { notification } = AntApp.useApp();

  useEffect(() => {
    let active = true;
    getAdminBootstrapStatus()
      .then(({ canRegisterAdmin: canCreate }) => {
        if (active) setCanRegisterAdmin(canCreate);
      })
      .catch((error) => {
        if (active) {
          setBootstrapStatusError(error?.response?.data?.message || "Admin signup availability could not be checked.");
        }
      });
    return () => { active = false; };
  }, []);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirm,
        accountRole: values.accountRole,
      });

      notification.success({
        message: "Registration successful",
        description: response?.message || "Your account has been created.",
      });
      form.resetFields(["name", "email", "password", "confirm", "agreement", "accountRole"]);
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
      initialValues={{ accountRole: "user" }}
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
        label={<span className="register-form-label">Account type</span>}
        name="accountRole"
        rules={[{ required: true, message: "Choose an account type." }]}
      >
        <Select
          size="large"
          options={[
            { value: "user", label: "User" },
            {
              value: "admin",
              label: canRegisterAdmin ? "Administrator (first admin account)" : "Administrator (create from admin dashboard)",
              disabled: !canRegisterAdmin,
            },
          ]}
        />
      </Form.Item>
      {bootstrapStatusError && <p role="status">{bootstrapStatusError} Admin accounts can also be created by an existing administrator.</p>}

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
          <button type="button" onClick={onOpenPolicy} className="register-form-inline-link">
            Terms & Conditions
          </button>{" "}
          and{" "}
          <button type="button" onClick={onOpenPolicy} className="register-form-inline-link">
            Privacy Policy
          </button>
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

    </Form>
  );
}