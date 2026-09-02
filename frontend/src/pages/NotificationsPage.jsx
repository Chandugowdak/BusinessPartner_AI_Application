import { BellOutlined, CheckCircleFilled, UserAddOutlined } from "@ant-design/icons";
import WorkspacePage from "./WorkspacePage";

const notifications = [
  { icon: UserAddOutlined, title: "Maya Kapoor accepted your connection", detail: "2 hours ago", fresh: true },
  { icon: CheckCircleFilled, title: "Your profile is ready to be discovered", detail: "Yesterday", fresh: false },
  { icon: BellOutlined, title: "Three new partners match your interests", detail: "2 days ago", fresh: false },
];

export default function NotificationsPage() {
  return (
    <WorkspacePage eyebrow="UPDATES" title="Notifications" description="Stay close to the activity that matters to your network.">
      <section className="workspace-list" aria-label="Notifications">
        {notifications.map(({ icon: Icon, title, detail, fresh }) => <article className={`workspace-row notification-row${fresh ? " unread" : ""}`} key={title}><div className="notification-icon"><Icon /></div><div className="workspace-row-copy"><h2>{title}</h2><span>{detail}</span></div>{fresh ? <span className="notification-dot" aria-label="Unread" /> : null}</article>)}
      </section>
    </WorkspacePage>
  );
}
