import { Badge, Button, Dropdown, Spin } from "antd";
import { BellOutlined, CheckCircleFilled, HomeOutlined, InfoCircleOutlined, LogoutOutlined, SearchOutlined, TeamOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNotifications, markNotificationsRead } from "../../DataProvider/AuthDataProvider";
import BrandLogo from "./BrandLogo";
import NavigationLink from "./NavigationLink";
import "./Navbar.css";

const navigationItems = [
  { to: "/home", label: "Home", icon: HomeOutlined },
  { to: "/find-partners", label: "Find Partners", icon: SearchOutlined },
  { to: "/connections", label: "My Connections", icon: TeamOutlined },
  { to: "/requests", label: "My Requests", icon: UserAddOutlined },
  { to: "/profile", label: "Profile", icon: UserOutlined },
];

const publicNavigationItems = [
  { to: "/about", label: "About", icon: InfoCircleOutlined },
  { to: "/blog", label: "Journal", icon: InfoCircleOutlined },
  { to: "/help", label: "Help", icon: TeamOutlined },
];

const notificationTitle = (item) => item.type === "connection_accepted" ? `${item.actor?.name || "A partner"} accepted your request` : `${item.actor?.name || "A partner"} sent you a connection request`;
const notificationTime = (date) => date ? new Date(date).toLocaleDateString([], { month: "short", day: "numeric" }) : "";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token")) && !["/login", "/register"].includes(location.pathname);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
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
  const signOut = () => { localStorage.removeItem("token"); localStorage.removeItem("currentUser"); localStorage.removeItem("verificationSkipped"); navigate("/login", { replace: true }); };

  return <header className="home-nav"><div className="home-nav-inner">
    <BrandLogo />
    <nav className="workspace-links" aria-label="Main navigation">
      {(isAuthenticated ? navigationItems : publicNavigationItems).map((item) => <NavigationLink key={item.to} {...item} badge={item.badge} />)}
    </nav>
    <div className="home-actions">{isAuthenticated ? <><Dropdown trigger={["click"]} onOpenChange={handleNotificationOpen} dropdownRender={() => <div className="notification-popover"><div className="notification-popover-header"><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} new` : "All caught up"}</span></div>{isNotificationLoading ? <Spin /> : notifications.length ? notifications.slice(0, 5).map((item) => <div className={`notification-popover-item${item.readAt ? "" : " unread"}`} key={item._id}><CheckCircleFilled /><div><strong>{notificationTitle(item)}</strong><span>{notificationTime(item.createdAt)}</span></div></div>) : <p>No new activity yet.</p>}</div>}><button type="button" className="notification-button" aria-label="Open notifications"><Badge count={unreadCount} size="small"><BellOutlined /></Badge></button></Dropdown><Button type="primary" icon={<LogoutOutlined />} onClick={signOut}>Sign out</Button></> : <Button type="primary" onClick={() => navigate("/login")}>Sign in</Button>}</div>
  </div></header>;
}