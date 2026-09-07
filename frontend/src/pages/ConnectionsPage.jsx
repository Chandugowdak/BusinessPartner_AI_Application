import { CheckCircleFilled, ClockCircleOutlined } from "@ant-design/icons";
import WorkspacePage from "./WorkspacePage";

const connections = [
  { initials: "MK", name: "Maya Kapoor", role: "Operations partner", detail: "Connected 2 days ago", status: "Active", tone: "gold" },
  { initials: "DL", name: "Daniel Lee", role: "Finance advisor", detail: "Connected last week", status: "Active", tone: "blue" },
  { initials: "NS", name: "Nora Singh", role: "UX researcher", detail: "Request sent yesterday", status: "Pending", tone: "green" },
];

export default function ConnectionsPage() {
  return (
    <WorkspacePage eyebrow="YOUR NETWORK" title="My connections" description="Keep track of the people you have met and the conversations worth continuing.">
      <section className="workspace-list" aria-label="Your connections">
        {connections.map((connection) => <article className="workspace-row" key={connection.name}><div className={`partner-avatar ${connection.tone}`}>{connection.initials}</div><div className="workspace-row-copy"><h2>{connection.name}</h2><p>{connection.role}</p><span>{connection.detail}</span></div><span className={`status-label ${connection.status === "Active" ? "active" : "pending"}`}>{connection.status === "Active" ? <CheckCircleFilled /> : <ClockCircleOutlined />} {connection.status}</span></article>)}
      </section>
    </WorkspacePage>
  );
}
