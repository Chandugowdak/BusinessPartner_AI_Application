import { EditOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { App as AntApp, Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { updateUser } from "../DataProvider/AuthDataProvider";
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
  const [form] = Form.useForm();
  const { notification } = AntApp.useApp();

  const openEditor = () => {
    form.setFieldsValue({ name: profile.name, email: profile.email });
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
      const updatedUser = response?.user || { ...profile, ...values };
      setProfile(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
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
        <article className="profile-card"><div className="profile-avatar">{getInitials(profile.name)}</div><h2>{profile.name || "Your name"}</h2><p>BizMatch member</p><span><MailOutlined /> {profile.email || "No email available"}</span><button className="profile-edit" onClick={openEditor}><EditOutlined /> Edit details</button></article>
        <article className="profile-details"><span className="workspace-eyebrow">ACCOUNT DETAILS</span><p>These details are connected to your BizMatch account and are saved to your profile.</p><div className="partner-tags"><span className="interest-tag">{profile.name || "Name not set"}</span><span className="interest-tag">{profile.email || "Email not set"}</span></div></article>
      </section>
      <Modal title="Edit profile" open={isEditing} onCancel={() => setIsEditing(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={saveProfile} requiredMark={false} className="profile-form">
          <Form.Item label="Full name" name="name" rules={[{ required: true, message: "Please enter your name." }]}>
            <Input prefix={<UserOutlined />} placeholder="Your full name" />
          </Form.Item>
          <Form.Item label="Email address" name="email" rules={[{ required: true, message: "Please enter your email address." }, { type: "email", message: "Please enter a valid email address." }]}>
            <Input prefix={<MailOutlined />} placeholder="you@example.com" />
          </Form.Item>
          <div className="profile-form-actions"><Button onClick={() => setIsEditing(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isSaving}>Save changes</Button></div>
        </Form>
      </Modal>
    </WorkspacePage>
  );
}
