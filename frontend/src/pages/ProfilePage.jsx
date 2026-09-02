import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons";
import WorkspacePage from "./WorkspacePage";

const profile = { name: "Alex Morgan", role: "Founder & product builder", location: "Bengaluru, India", initials: "AM", about: "Building useful products with thoughtful people. Always open to conversations around early-stage ideas, product strategy, and sustainable growth.", interests: ["Product strategy", "Entrepreneurship", "Design systems"] };

export default function ProfilePage() {
  return (
    <WorkspacePage eyebrow="YOUR IDENTITY" title="Profile" description="Make it easy for the right people to understand what you are building." action="Edit profile">
      <section className="profile-layout">
        <article className="profile-card"><div className="profile-avatar">{profile.initials}</div><h2>{profile.name}</h2><p>{profile.role}</p><span><EnvironmentOutlined /> {profile.location}</span><button className="profile-edit"><EditOutlined /> Edit details</button></article>
        <article className="profile-details"><span className="workspace-eyebrow">ABOUT YOU</span><p>{profile.about}</p><div className="partner-tags">{profile.interests.map((interest) => <span className="interest-tag" key={interest}>{interest}</span>)}</div></article>
      </section>
    </WorkspacePage>
  );
}
