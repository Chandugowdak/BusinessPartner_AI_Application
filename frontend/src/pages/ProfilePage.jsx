import {
  EditOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ProfileEditorModal from "../components/ProfileEditor/ProfileEditorModal";
import WorkspacePage from "./WorkspacePage";
import "./ProfilePage.css";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || {};
  } catch {
    return {};
  }
};

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function ProfilePage() {
  const [profile, setProfile] = useState(getStoredUser);
  const [isEditing, setIsEditing] = useState(false);
  const openEditor = () => setIsEditing(true);
  const completion = profile.profileCompletion || 20;
  const isVerified = profile.verificationStatus === "verified";

  return (
    <WorkspacePage
      className="profile-workspace"
      eyebrow="YOUR IDENTITY"
      title="Your profile"
      description="Show people what you bring to the table. Keep your details current to make stronger business connections."
      action="Edit profile"
      onAction={openEditor}
    >
      <section className="profile-layout" aria-label="Your profile details">
        <article className="profile-card">
          <div className="profile-card-cover" aria-hidden="true" />
          <div className="profile-avatar">
            {profile.photoUrl
              ? <img src={profile.photoUrl} alt={profile.name || "Profile"} />
              : getInitials(profile.name)}
          </div>
          <div className={`profile-status${isVerified ? " is-verified" : ""}`}>
            <SafetyCertificateOutlined />
            {isVerified ? "Verified profile" : "Profile in progress"}
          </div>
          <h2>{profile.name || "Your name"}</h2>
          <p className="profile-role">{profile.role || "BizMatch member"}</p>
          {profile.professionalField && <span className="profile-field">{profile.professionalField}</span>}
          <div className="profile-contact">
            <span><MailOutlined />{profile.email || "No email available"}</span>
            {profile.phone && <span><PhoneOutlined />{profile.phone}</span>}
          </div>
        </article>

        <article className="profile-details">
          <div className="profile-details-heading">
            <div>
              <span className="workspace-eyebrow">YOUR PROFILE STRENGTH</span>
              <h2>{completion}% <span>complete</span></h2>
            </div>
            <button className="profile-edit" onClick={openEditor}>
              <EditOutlined /> Edit details
            </button>
          </div>
          <div
            className="profile-completion-bar"
            role="progressbar"
            aria-label="Profile completion"
            aria-valuenow={completion}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span style={{ width: `${completion}%` }} />
          </div>
          <div className={`profile-verification-note${isVerified ? " is-verified" : ""}`}>
            <SafetyCertificateOutlined />
            <span>
              Verification status
              <strong>{profile.verificationStatus || "Not started"}</strong>
            </span>
          </div>
          <div className="profile-summary-heading">
            <div>
              <span className="workspace-eyebrow">AT A GLANCE</span>
              <h3>Professional details</h3>
            </div>
            <UserOutlined aria-hidden="true" />
          </div>
          <div className="profile-summary-grid">
            <div><span>Professional field</span><strong>{profile.professionalField || "Not added yet"}</strong></div>
            <div><span>Role</span><strong>{profile.role || "Not added yet"}</strong></div>
            <div><span>LinkedIn</span><strong>{profile.linkedInUrl ? "Profile added" : "Not added yet"}</strong></div>
            <div><span>X profile</span><strong>{profile.xUrl ? "Profile added" : "Not added yet"}</strong></div>
          </div>
          <div className="profile-complete-hint">
            <LinkOutlined />
            <p>A complete profile helps partners understand your experience and find the right way to connect.</p>
          </div>
        </article>
      </section>
      <ProfileEditorModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSaved={setProfile}
        profile={profile}
        completion={completion}
      />
    </WorkspacePage>
  );
}
