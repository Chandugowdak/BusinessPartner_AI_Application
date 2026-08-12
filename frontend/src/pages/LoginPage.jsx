import { Button, Checkbox, Form, Input, message } from "antd";
import { ArrowRightOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

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

  const onFinish = (values) => {
    console.log("Login submit:", values);
    message.success("Welcome back!");
    form.resetFields(["password"]);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      requiredMark={false}
      autoComplete="off"
    >
      <Form.Item
        label={<span className="fw-semibold">Email address</span>}
        name="email"
        rules={[
          { required: true, message: "Please enter your email address." },
          { type: "email", message: "Please enter a valid email address." },
        ]}
      >
        <Input
          size="large"
          prefix={<MailOutlined className="text-secondary" />}
          placeholder="you@example.com"
          style={{ height: 48, borderRadius: 10 }}
        />
      </Form.Item>

      <Form.Item
        label={<span className="fw-semibold">Password</span>}
        name="password"
        rules={[{ required: true, message: "Please enter your password." }]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="text-secondary" />}
          placeholder="Enter your password"
          style={{ height: 48, borderRadius: 10 }}
        />
      </Form.Item>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none", fontSize: 14 }}
        >
          Forgot password?
        </a>
      </div>

      <Form.Item className="mb-3">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          style={{ height: 50, borderRadius: 10, fontWeight: 600, fontSize: 16 }}
        >
          Sign in
        </Button>
      </Form.Item>

      <div className="text-center">
        <span className="text-secondary" style={{ fontSize: 14 }}>
          New to PartnerMatch?{" "}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToRegister?.();
          }}
          className="fw-semibold"
          style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}
        >
          Create your free account →
        </a>
      </div>
    </Form>
  );
}