import { Badge, Button, Dropdown, Spin } from "antd";
import { BellOutlined, CalendarOutlined, CheckCircleFilled, CloseOutlined, CompassOutlined, DownOutlined, HistoryOutlined, HomeOutlined, InfoCircleOutlined, LogoutOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined, ReadOutlined, SearchOutlined, SettingOutlined, SolutionOutlined, TeamOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteAllNotifications, deleteNotification, getNotifications, markNotificationsRead } from "../../DataProvider/AuthDataProvider";
import BrandLogo from "./BrandLogo";
import NavigationLink from "./NavigationLink";
import "./Navbar.css";

const navigationItems = [
  { to: "/home", label: "Home", icon: HomeOutlined },
  { to: "/jobs", label: "Jobs", icon: SolutionOutlined },
  { to: "/find-partners", label: "Find Partners", icon: SearchOutlined },
  { to: "/connections", label: "My Connections", icon: TeamOutlined },
  { to: "/requests", label: "My Requests", icon: UserAddOutlined },
  { to: "/email/history", label: "History", icon: HistoryOutlined },
  { to: "/help", label: "Help", icon: QuestionCircleOutlined },
];

const publicNavigationItems = [
  { to: "/about", label: "About", icon: InfoCircleOutlined },
  { to: "/how-matching-works", label: "How it works", icon: CompassOutlined },
  { to: "/blog", label: "Journal", icon: ReadOutlined },
  { to: "/help", label: "Help", icon: QuestionCircleOutlined },
];

const notificationTitle = (item) => item.type === "connection_accepted" ? `${item.actor?.name || "A partner"} accepted your request` : item.type === "message" ? `${item.actor?.name || "A partner"} sent you a message` : `${item.actor?.name || "A partner"} sent you a connection request`;
const notificationTime = (date) => date ? new Date(date).toLocaleDateString([], { month: "short", day: "numeric" }) : "";
const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function Navbar({ isAuthenticated, collapsed, onToggleCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSystemPath = pathname === "/email/configuration" || pathname === "/email/scheduler";
  const [systemNavigationOpen, setSystemNavigationOpen] = useState(isSystemPath);
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

  return <>
    <header className="home-nav">
      <div className="home-nav-inner">
        {isAuthenticated ? <button type="button" className="sidebar-toggle" onClick={onToggleCollapsed} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} title={collapsed ? "Expand navigation" : "Collapse navigation"}>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</button> : <BrandLogo />}
        {!isAuthenticated && <nav className="workspace-links public-links" aria-label="Main navigation">{publicNavigationItems.map((item) => <NavigationLink key={item.to} {...item} />)}</nav>}
        <div className={`home-actions${isAuthenticated ? "" : " public-actions"}`}>{isAuthenticated ? <><div className="nav-action-container"><Dropdown trigger={["click"]} onOpenChange={handleNotificationOpen} dropdownRender={() => <div className="notification-popover"><div className="notification-popover-header"><strong>Notifications</strong>{notifications.length ? <button type="button" className="clear-notifications-button" onClick={removeAllNotifications}>Clear all</button> : <span>All caught up</span>}</div>{isNotificationLoading ? <Spin /> : notifications.length ? notifications.slice(0, 5).map((item) => <div className={`notification-popover-item${item.readAt ? "" : " unread"}`} key={item._id}><CheckCircleFilled /><div><strong>{notificationTitle(item)}</strong><span>{notificationTime(item.createdAt)}</span></div><button type="button" className="remove-notification-button" aria-label={`Clear notification from ${item.actor?.name || "partner"}`} onClick={(event) => { event.stopPropagation(); removeNotification(item._id); }}><CloseOutlined /></button></div>) : <p>No new activity yet.</p>}</div>}><button type="button" className={`notification-button${unreadCount ? " has-unread" : ""}`} aria-label="Open notifications"><Badge count={unreadCount} size="small"><BellOutlined /></Badge></button></Dropdown></div><div className="nav-action-container"><Dropdown trigger={["click"]} menu={{ items: [{ key: "profile", label: "View profile", icon: <UserOutlined /> }, { type: "divider" }, { key: "logout", label: "Log out", icon: <LogoutOutlined />, danger: true }], onClick: ({ key }) => key === "profile" ? navigate("/profile") : signOut() }} placement="bottomRight"><button type="button" className="profile-menu-button" aria-label="Open profile menu"><span className="profile-menu-avatar">{currentUser.photoUrl ? <img src={currentUser.photoUrl} alt="" /> : getInitials(currentUser.name)}</span><span className="profile-menu-name">{currentUser.name || "Profile"}</span></button></Dropdown></div></> : <><Button type="text" className="public-signin" onClick={() => navigate("/login")}>Sign in</Button><Button type="primary" onClick={() => navigate("/register")}>Get started</Button></>}</div>
      </div>
    </header>
    {isAuthenticated && <aside className="workspace-sidebar" aria-label="Workspace navigation">
      <BrandLogo />
      <nav className="workspace-links" aria-label="Main navigation">
        {navigationItems.map((item) => <NavigationLink key={item.label} {...item} collapsed={collapsed} />)}
          <div className={`workspace-nav-group${systemNavigationOpen ? " expanded" : ""}`}>
            <button type="button" className={`workspace-link workspace-group-toggle${isSystemPath ? " active" : ""}`} onClick={() => setSystemNavigationOpen((open) => !open)} aria-expanded={systemNavigationOpen}>
              <SettingOutlined /><span>System</span><DownOutlined className="workspace-group-chevron" />
            </button>
            {systemNavigationOpen && <div className="workspace-sub-links">
              <NavigationLink to="/email/configuration" label="Email configuration" icon={MailOutlined} collapsed={collapsed} />
              <NavigationLink to="/email/scheduler" label="Cron scheduler" icon={CalendarOutlined} collapsed={collapsed} />
            </div>}
          </div>
      </nav>
    </aside>}
  </>;
}