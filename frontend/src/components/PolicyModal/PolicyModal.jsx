import { Modal } from "antd";
import { CheckCircleOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import "./PolicyModal.css";

const policySections = [
  {
    icon: <SafetyCertificateOutlined />,
    title: "What we collect",
    text: "We collect the profile details you choose to share, such as your name, email, skills, location, and professional goals.",
  },
  {
    icon: <LockOutlined />,
    title: "Why we use it",
    text: "Your information helps us create relevant partner recommendations, support conversations, secure your account, and improve BizMatch.",
  },
  {
    icon: <CheckCircleOutlined />,
    title: "Your choices",
    text: "You decide what to add to your profile. You can update your details, manage your connections, or ask us to remove your account at any time.",
  },
];

export default function PolicyModal({ open, onClose, onAccept }) {
  return (
    <Modal
      open={open}
      title="BizMatch privacy policy"
      onCancel={onClose}
      onOk={onAccept || onClose}
      okText="I understand"
      cancelText="Cancel"
      centered
      className="policy-modal"
    >
      <p className="policy-intro">
        We use your information to make professional introductions more useful, relevant, and safe. We do not sell your personal information.
      </p>
      <div className="policy-sections">
        {policySections.map((section) => (
          <section className="policy-section" key={section.title}>
            <span className="policy-section-icon">{section.icon}</span>
            <div>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
      </div>
      <p className="policy-note">
        By selecting “I understand”, you confirm that you have read this summary and agree to use BizMatch respectfully.
      </p>
    </Modal>
  );
}
