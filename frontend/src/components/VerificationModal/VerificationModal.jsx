import { useEffect, useState } from "react";
import { App as AntApp, Button, Form, Input, Modal, Progress, Select } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { updateUser } from "../../DataProvider/AuthDataProvider";
import "./VerificationModal.css";

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("currentUser")) || {}; } catch { return {}; }
};

export default function VerificationModal({ open, onClose, onSaved }) {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [profile] = useState(getStoredUser);
  const { notification } = AntApp.useApp();

  useEffect(() => {
    if (open) form.setFieldsValue(profile);
  }, [open, profile, form]);

  const saveVerification = async (values) => {
    if (!profile._id) return;
    try {
      setIsSaving(true);
      const response = await updateUser(profile._id, values);
      const updatedUser = response.user;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      notification.success({ message: "Verification details saved", description: response.message });
      onSaved?.(updatedUser);
      onClose?.();
    } catch (error) {
      notification.error({ message: "Could not save verification", description: error?.response?.data?.message || "Please check the details and try again." });
    } finally { setIsSaving(false); }
  };

  return <Modal open={open} onCancel={onClose} footer={null} title={<span><SafetyCertificateOutlined /> Complete your verification</span>} destroyOnClose>
    <div className="verification-intro">A complete, verified profile helps us recommend trustworthy business partners. Your ID number is stored securely and never shown publicly.</div>
    <Progress percent={profile.profileCompletion || 20} strokeColor="#ff8a00" />
    <Form form={form} layout="vertical" onFinish={saveVerification} requiredMark={false} className="verification-form">
      <Form.Item label="Phone number" name="phone" rules={[{ required: true, message: "Enter your phone number." }, { pattern: /^\\+?[0-9]{10,15}$/, message: "Use a valid phone number." }]}><Input placeholder="+91 9876543210" /></Form.Item>
      <Form.Item label="Professional field" name="professionalField" rules={[{ required: true, message: "Tell us your professional field." }]}><Input placeholder="e.g. FinTech, Design, Manufacturing" /></Form.Item>
      <Form.Item label="Government ID type" name="governmentIdType" rules={[{ required: true, message: "Choose an ID type." }]}><Select options={[{ value: "aadhaar", label: "Aadhaar" }, { value: "pan", label: "PAN Card" }, { value: "other", label: "Other government ID" }]} /></Form.Item>
      <Form.Item label="Government ID number" name="governmentId" rules={[{ required: true, message: "Enter your ID number." }]}><Input.Password placeholder="Your ID number" /></Form.Item>
      <Form.Item label="LinkedIn profile URL" name="linkedInUrl" rules={[{ type: "url", message: "Enter a valid URL." }]}><Input placeholder="https://www.linkedin.com/in/your-name" /></Form.Item>
      <Form.Item label="X profile URL" name="xUrl" rules={[{ type: "url", message: "Enter a valid URL." }]}><Input placeholder="https://x.com/your-handle" /></Form.Item>
      <div className="verification-actions"><Button onClick={onClose}>Skip for now</Button><Button type="primary" htmlType="submit" loading={isSaving}>Save and verify</Button></div>
    </Form>
  </Modal>;
}
