import { useEffect, useState } from "react";
import { App as AntApp, Avatar, Button, Card, Empty, Form, Input, Modal, Spin, Switch, Tag } from "antd";
import { SafetyCertificateOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { createManagedAdmin, getManagedUsers, updateUserPermissions } from "../DataProvider/AuthDataProvider";
import { FEATURE_PERMISSIONS } from "../permissions";
import WorkspacePage from "./WorkspacePage";
import "./RolesPermissionsPage.css";

export default function RolesPermissionsPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingUserId, setSavingUserId] = useState("");
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [adminForm] = Form.useForm();
  const { notification } = AntApp.useApp();

  useEffect(() => {
    let active = true;
    getManagedUsers()
      .then((managedUsers) => { if (active) setUsers(managedUsers); })
      .catch((error) => {
        if (active) setLoadError(error?.response?.data?.message || "Could not load user accounts.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const handlePermissionChange = async (user, feature, enabled) => {
    const permissions = Object.fromEntries(
      FEATURE_PERMISSIONS.map(({ key }) => [key, key === feature ? enabled : user.permissions?.[key] === true]),
    );
    setSavingUserId(String(user._id));
    try {
      const response = await updateUserPermissions(user._id, permissions);
      setUsers((items) => items.map((item) => String(item._id) === String(user._id) ? response.user : item));
      notification.success({ message: "Access updated", description: `${user.name}’s feature access has been saved.` });
    } catch (error) {
      notification.error({
        message: "Could not update access",
        description: error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setSavingUserId("");
    }
  };

  const handleCreateAdmin = async (values) => {
    setIsCreatingAdmin(true);
    try {
      const response = await createManagedAdmin(values);
      notification.success({
        message: "Administrator created",
        description: `${response.user.name} can now sign in as an administrator.`,
      });
      adminForm.resetFields();
      setAdminModalOpen(false);
    } catch (error) {
      notification.error({
        message: "Could not create administrator",
        description: error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <WorkspacePage
      eyebrow="ADMINISTRATION"
      title="Roles & permissions"
      description="Control which workspace features each standard user can access."
      className="roles-permissions-page"
    >
      <div className="roles-permissions-summary">
        <div className="roles-summary-icon"><SafetyCertificateOutlined /></div>
        <div>
          <strong>Administrator controls</strong>
          <p>Changes are enforced across navigation, pages and protected APIs. Administrators retain full access.</p>
        </div>
        <Tag color="gold">{users.length} {users.length === 1 ? "USER" : "USERS"}</Tag>
      </div>

      <div className="roles-permissions-toolbar">
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAdminModalOpen(true)}>
          Create administrator
        </Button>
      </div>

      <Modal
        title="Create administrator"
        open={adminModalOpen}
        onCancel={() => !isCreatingAdmin && setAdminModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={adminForm} layout="vertical" onFinish={handleCreateAdmin} requiredMark={false}>
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, whitespace: true, message: "Enter the administrator's name." }]}
          >
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Enter an email address." },
              { type: "email", message: "Enter a valid email address." },
            ]}
          >
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Create a password." },
              { min: 12, message: "Administrator passwords must contain at least 12 characters." },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm the password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(new Error("The passwords do not match."));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isCreatingAdmin}>
            Create administrator
          </Button>
        </Form>
      </Modal>

      {loadError && <div className="roles-permissions-error" role="alert">{loadError}</div>}
      {isLoading ? (
        <div className="roles-permissions-loading"><Spin size="large" /></div>
      ) : users.length ? (
        <div className="managed-user-grid">
          {users.map((user) => (
            <Card className="managed-user-card" key={user._id}>
              <div className="managed-user-heading">
                <Avatar size={44} src={user.photoUrl} icon={!user.photoUrl && <UserOutlined />} />
                <div className="managed-user-identity">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <Tag color="blue">USER</Tag>
              </div>
              <div className="feature-permission-list">
                {FEATURE_PERMISSIONS.map(({ key, label, description }) => (
                  <div className="feature-permission-row" key={key}>
                    <div className="feature-permission-copy">
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </div>
                    <Switch
                      size="small"
                      checked={user.permissions?.[key] === true}
                      disabled={savingUserId === String(user._id)}
                      loading={savingUserId === String(user._id)}
                      onChange={(enabled) => handlePermissionChange(user, key, enabled)}
                      aria-label={`${label} access for ${user.name}`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          className="managed-users-empty"
          description="No standard user accounts yet"
        />
      )}
    </WorkspacePage>
  );
}
