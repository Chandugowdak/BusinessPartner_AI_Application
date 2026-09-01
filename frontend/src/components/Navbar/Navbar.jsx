import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import logo from "../../assets/bizmatch-logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const signOut = () => { localStorage.removeItem("token"); navigate("/login", { replace: true }); };

  return <header className="home-nav"><div className="home-nav-inner">
    <button className="home-brand" onClick={() => navigate("/home")} aria-label="BizMatch home"><img src={logo} alt="" /><span>Biz<span>Match</span></span></button>
    <nav className="home-links" aria-label="Main navigation"><a className="active" href="#discover">Discover</a><a href="#how-it-works">How it works</a><a href="#community">Community</a></nav>
    <div className="home-actions"><button className="home-search" aria-label="Search"><SearchOutlined /></button><Button type="primary" icon={<LogoutOutlined />} onClick={signOut}>Sign out</Button></div>
  </div></header>;
}