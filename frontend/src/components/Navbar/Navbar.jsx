import { Badge, Button, Dropdown, Spin } from "antd";
import { BellOutlined, CheckCircleFilled, CloseOutlined, HomeOutlined, InfoCircleOutlined, LogoutOutlined, QuestionCircleOutlined, SearchOutlined, TeamOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteAllNotifications, deleteNotification, getNotifications, markNotificationsRead } from "../../DataProvider/AuthDataProvider";
import BrandLogo from "./BrandLogo";
import NavigationLink from "./NavigationLink";
import "./Navbar.css";

const navigationItems = [
  { to: "/home", label: "Home", icon: HomeOutlined },
  { to: "/find-partners", label: "Find Partners", icon: SearchOutlined },
  { to: "/connections", label: "My Connections", icon: TeamOutlined },
  { to: "/requests", label: "My Requests", icon: UserAddOutlined },
  { to: "/help", label: "Help", icon: QuestionCircleOutlined },
];

const publicNavigationItems = [
  { to: "/about", label: "About", icon: InfoCircleOutlined },
  { to: "/how-matching-works", label: "How it works", icon: QuestionCircleOutlined },
  { to: "/blog", label: "Journal", icon: InfoCircleOutlined },
  { to: "/help", label: "Help", icon: TeamOutlined },
];

const notificationTitle = (item) => item.type === "connection_accepted" ? `${item.actor?.name || "A partner"} accepted your request` : item.type === "message" ? `${item.actor?.name || "A partner"} sent you a message` : `${item.actor?.name || "A partner"} sent you a connection request`;
const notificationTime = (date) => date ? new Date(date).toLocaleDateString([], { month: "short", day: "numeric" }) : "";
const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token")) && !["/login", "/register"].includes(location.pathname);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [currentUser] = useState(() => { try { return JSON.parse(localStorage.getItem("currentUser")) || {}; } catch { return {}; } });
  useEffect(() => { if (!isAuthenticated) return; getNotifications().then((response) => { setUnreadCount(response.unreadCount || 0); setNotifications(response.notifications || []); }).catch(() => {}); }, [isAuthenticated]);
  const handleNotificationOpen = async (open) => {
    if (!open) return;
    setIsNotificationLoading(true);
    try {
      const response = await getNotifications();
      setNotifications(response.notifications || []);
      setUnreadCount(0);
      await markNotificationsRead();
    } catch { /* The navbar remains usable when notifications are unavailable. */ }
    finally { setIsNotificationLoading(false); }
  };
  const removeNotification = async (notificationId) => {
    setNotifications((items) => items.filter((item) => item._id !== notificationId));
    try { await deleteNotification(notificationId); } catch { getNotifications().then((response) => { setNotifications(response.notifications || []); setUnreadCount(response.unreadCount || 0); }).catch(() => {}); }
  };
  const removeAllNotifications = async () => {
    const previousNotifications = notifications;
    setNotifications([]);
    setUnreadCount(0);
    try { await deleteAllNotifications(); } catch { setNotifications(previousNotifications); }
  };
  const signOut = () => { localStorage.removeItem("token"); localStorage.removeItem("currentUser"); localStorage.removeItem("verificationSkipped"); navigate("/login", { replace: true }); };

  return <header className="home-nav"><div className="home-nav-inner">
    <BrandLogo />
    <nav className="workspace-links" aria-label="Main navigation">
      {(isAuthenticated ? navigationItems : publicNavigationItems).map((item) => <NavigationLink key={item.to} {...item} badge={item.badge} />)}
    </nav>
    <div className="home-actions">{isAuthenticated ? <><div className="nav-action-container"><Dropdown trigger={["click"]} onOpenChange={handleNotificationOpen} dropdownRender={() => <div className="notification-popover"><div className="notification-popover-header"><strong>Notifications</strong>{notifications.length ? <button type="button" className="clear-notifications-button" onClick={removeAllNotifications}>Clear all</button> : <span>All caught up</span>}</div>{isNotificationLoading ? <Spin /> : notifications.length ? notifications.slice(0, 5).map((item) => <div className={`notification-popover-item${item.readAt ? "" : " unread"}`} key={item._id}><CheckCircleFilled /><div><strong>{notificationTitle(item)}</strong><span>{notificationTime(item.createdAt)}</span></div><button type="button" className="remove-notification-button" aria-label={`Clear notification from ${item.actor?.name || "partner"}`} onClick={(event) => { event.stopPropagation(); removeNotification(item._id); }}><CloseOutlined /></button></div>) : <p>No new activity yet.</p>}</div>}><button type="button" className={`notification-button${unreadCount ? " has-unread" : ""}`} aria-label="Open notifications"><Badge count={unreadCount} size="small"><BellOutlined /></Badge></button></Dropdown></div><div className="nav-action-container"><Dropdown trigger={["click"]} menu={{ items: [{ key: "profile", label: "View profile", icon: <UserOutlined /> }, { type: "divider" }, { key: "logout", label: "Log out", icon: <LogoutOutlined />, danger: true }], onClick: ({ key }) => key === "profile" ? navigate("/profile") : signOut() }} placement="bottomRight"><button type="button" className="profile-menu-button" aria-label="Open profile menu"><span className="profile-menu-avatar">{currentUser.photoUrl ? <img src={currentUser.photoUrl} alt="" /> : getInitials(currentUser.name)}</span><span className="profile-menu-name">{currentUser.name || "Profile"}</span></button></Dropdown></div></> : <Button type="primary" onClick={() => navigate("/login")}>Sign in</Button>}</div>
  </div></header>;
}