import { Link, useLocation } from "react-router-dom";
import { InstagramFilled, LinkedinFilled, TwitterOutlined } from "@ant-design/icons";
import "./Footer.css";

const footerGroups = [
	{ links: [{ label: "About BizMatch", to: "/about" }, { label: "How matching works", to: "/how-matching-works" }, { label: "Find partners", to: "/find-partners" }] },
	{ links: [{ label: "Help center", to: "/help" }, { label: "Report an issue", to: "/report" }, { label: "Contact the team", to: "/contact" }] },
	{ links: [{ label: "Privacy policy", to: "/privacy" }, { label: "BizMatch journal", to: "/blog" }, { label: "Account safety", to: "/help" }] },
];

const socialLinks = [
	{ label: "Instagram", href: "https://www.instagram.com", icon: InstagramFilled },
	{ label: "X", href: "https://x.com", icon: TwitterOutlined },
	{ label: "LinkedIn", href: "https://www.linkedin.com", icon: LinkedinFilled },
];

export default function Footer() {
	useLocation();
	const isAuthenticated = Boolean(localStorage.getItem("token"));
	return <footer className="home-footer">
		<div className="footer-shell">
			<div className="footer-main"><div className="footer-intro"><div className="footer-brand"><span className="footer-brand-mark">b</span><strong>biz<span>match</span></strong></div><h3>Build better partnerships</h3><div className="footer-social-links">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>)}</div></div><div className="footer-links">{footerGroups.map((group, index) => <div className={`footer-link-group group-${index}`} key={index}><div className="footer-group-links">{group.links.map((link) => <Link key={link.label} to={link.to}>{link.label}</Link>)}</div></div>)}</div><div className="footer-app"><h2>Stay close to your matches</h2><p>Keep up with connection requests, conversations, and new partner opportunities.</p><div className="footer-store-links"><Link to="/find-partners" aria-label="Find a business partner"><span className="play-icon">→</span><span><small>START EXPLORING</small><b>Find partners</b></span></Link>{!isAuthenticated && <Link to="/register" aria-label="Create a BizMatch account"><span className="apple-icon">+</span><span><small>JOIN THE COMMUNITY</small><b>Create account</b></span></Link>}</div></div></div>
			<div className="footer-bottom"><span>© 2026 BizMatch. All rights reserved.</span></div>
		</div>
	</footer>;
}