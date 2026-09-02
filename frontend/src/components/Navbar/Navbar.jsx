import { Button } from "antd";
import { BellOutlined, HomeOutlined, LogoutOutlined, MessageOutlined, SearchOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import NavigationLink from "./NavigationLink";
import "./Navbar.css";

const navigationItems = [
  { to: "/home", label: "Home", icon: HomeOutlined },
  { to: "/find-partners", label: "Find Partners", icon: SearchOutlined },
  { to: "/connections", label: "My Connections", icon: TeamOutlined },
  { to: "/messages", label: "Messages", icon: MessageOutlined, badge: 1 },
  { to: "/notifications", label: "Notifications", icon: BellOutlined, badge: 3 },
  { to: "/profile", label: "Profile", icon: UserOutlined },
];

export default function Navbar() {
  const navigate = useNavigate();
  const signOut = () => { localStorage.removeItem("token"); navigate("/login", { replace: true }); };

  return <header className="home-nav"><div className="home-nav-inner">
    <BrandLogo />
    <nav className="workspace-links" aria-label="Main navigation">
      {navigationItems.map((item) => <NavigationLink key={item.to} {...item} />)}
    </nav>
    <div className="home-actions"><Button type="primary" icon={<LogoutOutlined />} onClick={signOut}>Sign out</Button></div>
  </div></header>;
}