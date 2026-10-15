import { GlobalOutlined, IdcardOutlined, LinkOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { App as AntApp, Button, Col, Form, Input, Modal, Progress, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { updateUser } from "../../DataProvider/AuthDataProvider";
import "./ProfileEditorModal.css";

const roleOptions = ["Founder", "Investor", "Mentor", "Professional", "Freelancer", "Student", "Other"].map((role) => ({ value: role, label: role }));
const idOptions = [{ value: "aadhaar", label: "Aadhaar" }, { value: "pan", label: "PAN Card" }, { value: "other", label: "Other government ID" }];
const getErrorMessage = (error) => error?.response?.data?.message || error?.response?.data?.error || (error?.request ? "The server did not respond. Check that the backend is running." : null) || error?.message || "Please check the form and try again.";

export default function ProfileEditorModal({ open, onClose, onSaved, profile, completion = 20, isVerification = false }) {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const { notification } = AntApp.useApp();

  useEffect(() => {
    if (open) form.setFieldsValue(profile);
  }, [open, profile, form]);

  const saveProfile = async (values) => {
    if (!profile?._id) { notification.error({ message: "Profile unavailable", description: "Please sign in again to edit your profile." }); return; }
    try {
      setIsSaving(true);
      const response = await updateUser(profile._id, values);
      const updatedUser = response?.user || { ...profile, ...values };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      onSaved?.(updatedUser);
      notification.success({ message: isVerification ? "Profile completed" : "Profile updated", description: response?.message || "Your changes have been saved." });
      onClose?.();
    } catch (error) { notification.error({ message: "Could not save profile", description: getErrorMessage(error) }); }
    finally { setIsSaving(false); }
  };

  return <Modal className={`profile-editor-modal${isVerification ? " profile-verification-modal" : ""}`} open={open} onCancel={onClose} footer={null} destroyOnClose width={720} centered title={<span className="profile-editor-title"><span className="profile-editor-title-icon"><SafetyCertificateOutlined /></span>{isVerification ? "Complete your profile" : "Edit profile"}</span>}>
    <div className="profile-editor-intro"><div><strong>{isVerification ? "Help partners get to know you" : "Keep your professional details current"}</strong><p>{isVerification ? "A complete profile helps us make more relevant, trustworthy introductions." : "These details are shown to potential business partners."}</p></div><div className="profile-editor-progress"><span>{completion}% complete</span><Progress percent={completion} showInfo={false} strokeColor="#d97706" /></div></div>
    <Form form={form} layout="vertical" onFinish={saveProfile} requiredMark={false} className="profile-editor-form">
      <div className="profile-editor-section"><span className="profile-editor-section-label">About you</span><Row gutter={16}>
        <Col xs={24} sm={12}><Form.Item label="Full name" name="name" rules={[{ required: true, message: "Please enter your name." }]}><Input prefix={<UserOutlined />} placeholder="Your full name" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item label="Email address" name="email" rules={[{ required: true, message: "Please enter your email address." }, { type: "email", message: "Please enter a valid email address." }]}><Input prefix={<MailOutlined />} placeholder="you@example.com" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item label="Phone number" name="phone" rules={[{ validator: (_, value) => !value || /^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g, "")) ? Promise.resolve() : Promise.reject(new Error("Use 10 to 15 digits.")) }]}><Input prefix={<PhoneOutlined />} placeholder="+91 9876543210" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item label="Role" name="role" rules={[{ required: true, message: "Choose the role partners should see." }]}><Select options={roleOptions} placeholder="Choose your role" /></Form.Item></Col>
        <Col xs={24}><Form.Item label="Professional field" name="professionalField"><Input prefix={<GlobalOutlined />} placeholder="e.g. FinTech, Design, Manufacturing" /></Form.Item></Col>
      </Row></div>
      <div className="profile-editor-section"><span className="profile-editor-section-label">Verification and links</span><Row gutter={16}>
        <Col xs={24} sm={12}><Form.Item label="Government ID type" name="governmentIdType"><Select options={idOptions} placeholder="Select ID type" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item label="Government ID number" name="governmentId"><Input.Password prefix={<IdcardOutlined />} placeholder="Enter to update verification" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item label="LinkedIn profile URL" name="linkedInUrl" rules={[{ type: "url", message: "Enter a valid URL." }]}><Input prefix={<LinkOutlined />} placeholder="https://linkedin.com/in/your-name" /></Form.Item></Col>
        <Col xs={24} sm={12}><Form.Item label="X profile URL" name="xUrl" rules={[{ type: "url", message: "Enter a valid URL." }]}><Input prefix={<LinkOutlined />} placeholder="https://x.com/your-handle" /></Form.Item></Col>
      </Row></div>
      <div className="profile-editor-photo"><div><span className="profile-editor-section-label">Profile photo</span><p>Paste a direct image URL. The URL is saved to your profile; no image file is uploaded to this app.</p></div><Form.Item label="Photo URL" name="photoUrl" rules={[{ max: 2048, message: "The photo URL must be 2048 characters or fewer." }, { validator: (_, value) => { if (!value) return Promise.resolve(); try { const parsedUrl = new URL(value); return ["http:", "https:"].includes(parsedUrl.protocol) && parsedUrl.hostname ? Promise.resolve() : Promise.reject(new Error("Enter a valid HTTP or HTTPS image URL.")); } catch { return Promise.reject(new Error("Enter a valid HTTP or HTTPS image URL.")); } } }]}><Input prefix={<LinkOutlined />} placeholder="https://example.com/your-photo.jpg" /></Form.Item></div>
      <div className="profile-editor-actions"><Button onClick={onClose}>{isVerification ? "Skip for now" : "Cancel"}</Button><Button type="primary" htmlType="submit" loading={isSaving}>{isVerification ? "Save and continue" : "Save changes"}</Button></div>
    </Form>
  </Modal>;
}