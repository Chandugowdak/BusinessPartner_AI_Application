import { BellOutlined, CheckCircleFilled, UserAddOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { getNotifications, markNotificationsRead } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";

const notificationCopy = {
  connection_request: { icon: UserAddOutlined, title: (actor) => `${actor} sent you a connection request` },
  connection_accepted: { icon: CheckCircleFilled, title: (actor) => `${actor} accepted your connection request` },
};

const formatTime = (date) => new Date(date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((response) => setNotifications(response.notifications || [])).catch(() => setNotifications([])).finally(() => setIsLoading(false));
    markNotificationsRead().catch(() => {});
  }, []);

  return (
    <WorkspacePage eyebrow="UPDATES" title="Notifications" description="Stay close to the activity that matters to your network.">
      {isLoading ? <div className="partner-loading"><Spin /></div> : <section className="workspace-list" aria-label="Notifications">
        {notifications.map((item) => { const copy = notificationCopy[item.type] || { icon: BellOutlined, title: () => "New network update" }; const Icon = copy.icon; return <article className={`workspace-row notification-row${item.readAt ? "" : " unread"}`} key={item._id}><div className="notification-icon"><Icon /></div><div className="workspace-row-copy"><h2>{copy.title(item.actor?.name || "A partner")}</h2><span>{formatTime(item.createdAt)}</span></div>{!item.readAt ? <span className="notification-dot" aria-label="Unread" /> : null}</article>; })}
        {!notifications.length && <p className="chat-empty">You are all caught up.</p>}
      </section>}
    </WorkspacePage>
  );
}
