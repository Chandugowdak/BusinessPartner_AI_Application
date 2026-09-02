import { Button, Tag } from "antd";
import { EnvironmentOutlined, PlusOutlined } from "@ant-design/icons";
import WorkspacePage from "./WorkspacePage";

const partners = [
  { initials: "AR", name: "Aarav Rao", role: "Product strategist", location: "Bengaluru, India", skills: ["Product", "Strategy"], tone: "gold" },
  { initials: "SM", name: "Sofia Martins", role: "Brand & growth lead", location: "Lisbon, Portugal", skills: ["Brand", "Growth"], tone: "blue" },
  { initials: "JN", name: "Jordan Nguyen", role: "Full-stack builder", location: "Melbourne, Australia", skills: ["Engineering", "SaaS"], tone: "green" },
];

export default function FindPartnersPage() {
  return (
    <WorkspacePage eyebrow="DISCOVER" title="Find your next partner" description="Explore people whose skills and ambitions complement your own." action="Update preferences">
      <section className="partner-grid" aria-label="Suggested partners">
        {partners.map((partner) => (
          <article className="partner-profile" key={partner.name}>
            <div className={`partner-avatar ${partner.tone}`}>{partner.initials}</div>
            <div className="partner-profile-main">
              <div className="partner-profile-heading"><div><h2>{partner.name}</h2><p>{partner.role}</p></div><button className="icon-action" aria-label={`Add ${partner.name}`}><PlusOutlined /></button></div>
              <span className="partner-location"><EnvironmentOutlined /> {partner.location}</span>
              <div className="partner-tags">{partner.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
              <Button type="primary" block>View profile</Button>
            </div>
          </article>
        ))}
      </section>
    </WorkspacePage>
  );
}
