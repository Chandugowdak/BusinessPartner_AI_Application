import { EditOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProfileEditorModal from "../components/ProfileEditor/ProfileEditorModal";
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
  const openEditor = () => setIsEditing(true);

  return (
    <WorkspacePage eyebrow="YOUR IDENTITY" title="Profile" description="A clear, current profile helps the right business partners understand what you bring to the table." action="Edit profile" onAction={openEditor}>
      <section className="profile-layout">
        <article className="profile-card"><div className="profile-avatar">{profile.photoUrl ? <img src={profile.photoUrl} alt={profile.name || "Profile"} /> : getInitials(profile.name)}</div><span className="profile-status"><SafetyCertificateOutlined /> {profile.verificationStatus === "verified" ? "Verified profile" : "Profile in progress"}</span><h2>{profile.name || "Your name"}</h2><p>{profile.role || "BizMatch member"}</p><div className="profile-contact"><span><MailOutlined /> {profile.email || "No email available"}</span>{profile.phone && <span><PhoneOutlined /> {profile.phone}</span>}</div></article>
        <article className="profile-details"><div className="profile-details-heading"><div><span className="workspace-eyebrow">PROFILE COMPLETION</span><h2>{profile.profileCompletion || 20}% ready to connect</h2></div><button className="profile-edit" onClick={openEditor}><EditOutlined /> Edit profile</button></div><div className="profile-completion-bar"><span style={{ width: `${profile.profileCompletion || 20}%` }} /></div><p><SafetyCertificateOutlined /> Verification status: <strong>{profile.verificationStatus || "not started"}</strong></p><div className="profile-summary-grid"><div><span>Professional field</span><strong>{profile.professionalField || "Not added yet"}</strong></div><div><span>Role</span><strong>{profile.role || "Not added yet"}</strong></div><div><span>LinkedIn</span><strong>{profile.linkedInUrl ? "Added" : "Not added yet"}</strong></div><div><span>X profile</span><strong>{profile.xUrl ? "Added" : "Not added yet"}</strong></div></div></article>
      </section>
      <ProfileEditorModal open={isEditing} onClose={() => setIsEditing(false)} onSaved={setProfile} profile={profile} completion={profile.profileCompletion || 20} />
    </WorkspacePage>
  );
}
