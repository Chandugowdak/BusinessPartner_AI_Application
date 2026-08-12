import { Button, Checkbox, Form, Input, message } from "antd";
import { ArrowRightOutlined, UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

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

  const onFinish = (values) => {
    console.log("Register submit:", values);
    message.success("Account created successfully!");
    form.resetFields(["password", "confirm", "agreement"]);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="register"
      onFinish={onFinish}
      requiredMark={false}
      autoComplete="off"
    >
      <Form.Item
        label={<span className="fw-semibold">Full name</span>}
        name="name"
        rules={[{ required: true, message: "Please enter your full name." }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="text-secondary" />}
          placeholder="Your full name"
          style={{ height: 48, borderRadius: 10 }}
        />
      </Form.Item>

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
        hasFeedback
        rules={[
          { required: true, message: "Please create a password." },
          { min: 8, message: "Password must contain at least 8 characters." },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="text-secondary" />}
          placeholder="Create a strong password"
          style={{ height: 48, borderRadius: 10 }}
        />
      </Form.Item>

      <Form.Item
        label={<span className="fw-semibold">Confirm password</span>}
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
          prefix={<LockOutlined className="text-secondary" />}
          placeholder="Confirm your password"
          style={{ height: 48, borderRadius: 10 }}
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        className="mb-4"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error("You must agree to the terms and conditions.")),
          },
        ]}
      >
        <Checkbox>
          I agree to the{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
        </Checkbox>
      </Form.Item>

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
          Create my account
        </Button>
      </Form.Item>

      <div className="text-center">
        <span className="text-secondary" style={{ fontSize: 14 }}>
          Already have a PartnerMatch account?{" "}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin?.();
          }}
          className="fw-semibold"
          style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}
        >
          Sign in →
        </a>
      </div>
    </Form>
  );
}