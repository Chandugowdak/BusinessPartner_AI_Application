import { EditOutlined, MailOutlined, UserOutlined, SafetyCertificateOutlined, CameraOutlined } from "@ant-design/icons";
import { App as AntApp, Button, Form, Input, Modal, Progress, Select, Upload } from "antd";
import { useState } from "react";
import { updateUser, uploadProfilePhoto } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || {};
  } catch {
    return {};
  }
};

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function ProfilePage() {
  const [profile, setProfile] = useState(getStoredUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [form] = Form.useForm();
  const { notification } = AntApp.useApp();

  const openEditor = () => {
    form.setFieldsValue(profile);
    setIsEditing(true);
  };

  const saveProfile = async (values) => {
    if (!profile._id) {
      notification.error({ message: "Profile unavailable", description: "Please sign in again to edit your profile." });
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateUser(profile._id, values);
      let updatedUser = response?.user || { ...profile, ...values };
      if (photoFile) {
        const photoResponse = await uploadProfilePhoto(profile._id, photoFile);
        updatedUser = photoResponse?.user || updatedUser;
      }
      setProfile(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setPhotoFile(null);
      setIsEditing(false);
      notification.success({ message: "Profile updated", description: response?.message || "Your changes have been saved." });
    } catch (error) {
      notification.error({ message: "Update failed", description: error?.response?.data?.message || "Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WorkspacePage eyebrow="YOUR IDENTITY" title="Profile" description="Keep your contact details up to date so partners know who they are connecting with." action="Edit profile" onAction={openEditor}>
      <section className="profile-layout">
        <article className="profile-card"><div className="profile-avatar">{profile.photoUrl ? <img src={profile.photoUrl} alt={profile.name || "Profile"} /> : getInitials(profile.name)}</div><h2>{profile.name || "Your name"}</h2><p>{profile.role || "BizMatch member"}</p><span><MailOutlined /> {profile.email || "No email available"}</span><button className="profile-edit" onClick={openEditor}><EditOutlined /> Edit details</button></article>
        <article className="profile-details"><span className="workspace-eyebrow">PROFILE COMPLETION</span><Progress percent={profile.profileCompletion || 20} strokeColor="#ff8a00" /><p><SafetyCertificateOutlined /> Identity status: {profile.verificationStatus || "not_started"}</p><div className="partner-tags"><span className="interest-tag">{profile.professionalField || "Professional field not set"}</span><span className="interest-tag">{profile.phone || "Phone not set"}</span></div></article>
      </section>
      <Modal title="Edit profile" open={isEditing} onCancel={() => setIsEditing(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={saveProfile} requiredMark={false} className="profile-form">
          <Form.Item label="Full name" name="name" rules={[{ required: true, message: "Please enter your name." }]}>
            <Input prefix={<UserOutlined />} placeholder="Your full name" />
          </Form.Item>
          <Form.Item label="Email address" name="email" rules={[{ required: true, message: "Please enter your email address." }, { type: "email", message: "Please enter a valid email address." }]}>
            <Input prefix={<MailOutlined />} placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Phone number" name="phone" rules={[{ validator: (_, value) => !value || /^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g, "")) ? Promise.resolve() : Promise.reject(new Error("Use a valid phone number with 10 to 15 digits.")) }]}><Input placeholder="+91 9876543210" /></Form.Item>
          <Form.Item label="Professional field" name="professionalField"><Input placeholder="e.g. FinTech, Design, Manufacturing" /></Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Choose the role you want partners to see." }]}><Select options={["Founder", "Investor", "Mentor", "Professional", "Freelancer", "Student", "Other"].map((role) => ({ value: role, label: role }))} placeholder="Choose your role" /></Form.Item>
          <Form.Item label="Profile photo"><Upload accept="image/*" maxCount={1} beforeUpload={(file) => { setPhotoFile(file); return false; }} onRemove={() => setPhotoFile(null)} showUploadList={photoFile ? { showPreviewIcon: false } : false}><Button icon={<CameraOutlined />}>Choose photo</Button></Upload><span className="upload-help">JPG, PNG or WEBP up to 5 MB.</span></Form.Item>
          <Form.Item label="Government ID type" name="governmentIdType"><Select options={[{ value: "aadhaar", label: "Aadhaar" }, { value: "pan", label: "PAN Card" }, { value: "other", label: "Other government ID" }]} /></Form.Item>
          <Form.Item label="Government ID number" name="governmentId"><Input.Password placeholder="Enter to update verification" /></Form.Item>
          <Form.Item label="LinkedIn profile URL" name="linkedInUrl"><Input placeholder="https://www.linkedin.com/in/your-name" /></Form.Item>
          <Form.Item label="X profile URL" name="xUrl"><Input placeholder="https://x.com/your-handle" /></Form.Item>
          <div className="profile-form-actions"><Button onClick={() => setIsEditing(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isSaving}>Save changes</Button></div>
        </Form>
      </Modal>
    </WorkspacePage>
  );
}
