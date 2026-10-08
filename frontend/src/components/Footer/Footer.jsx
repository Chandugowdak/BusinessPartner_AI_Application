import { Link } from "react-router-dom";
import { InstagramFilled, LinkedinFilled, TwitterOutlined } from "@ant-design/icons";
import "./Footer.css";

const footerGroups = [
	{ title: "Explore", links: [{ label: "About BizMatch", to: "/about" }, { label: "How matching works", to: "/how-matching-works" }, { label: "Find partners", to: "/find-partners" }] },
	{ title: "Get support", links: [{ label: "Help center", to: "/help" }, { label: "Report an issue", to: "/report" }, { label: "Contact the team", to: "/contact" }] },
	{ title: "Resources", links: [{ label: "Privacy policy", to: "/privacy" }, { label: "BizMatch journal", to: "/blog" }, { label: "Account safety", to: "/help" }] },
];

const socialLinks = [
	{ label: "Instagram", href: "https://www.instagram.com", icon: InstagramFilled },
	{ label: "X", href: "https://x.com", icon: TwitterOutlined },
	{ label: "LinkedIn", href: "https://www.linkedin.com", icon: LinkedinFilled },
];

export default function Footer() {
	const isAuthenticated = Boolean(localStorage.getItem("token"));
	return <footer className="home-footer">
		<div className="footer-shell">
			<div className="footer-main">
				<div className="footer-intro">
					<Link className="footer-brand" to="/" aria-label="BizMatch home">
						<span className="footer-brand-mark" aria-hidden="true">b</span>
						<strong>biz<span>match</span></strong>
					</Link>
					<h2>Build better partnerships.</h2>
					<p className="footer-tagline">Good things happen when the right people connect.</p>
					<div className="footer-social-links" aria-label="Follow BizMatch">
						{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>)}
					</div>
				</div>
				<nav className="footer-links" aria-label="Footer navigation">
					{footerGroups.map((group) => <div className="footer-link-group" key={group.title}>
						<h3>{group.title}</h3>
						<div className="footer-group-links">{group.links.map((link) => <Link key={link.label} to={link.to}>{link.label}</Link>)}</div>
					</div>)}
				</nav>
				<div className="footer-app">
					<span className="footer-eyebrow">YOUR NEXT CONNECTION STARTS HERE</span>
					<h2>Make room for what’s next.</h2>
					<p>Discover ambitious people, start conversations, and find the partner your business needs.</p>
					<div className="footer-store-links">
						<Link to="/find-partners" aria-label="Find a business partner"><span className="play-icon" aria-hidden="true">↗</span><span><small>READY WHEN YOU ARE</small><b>Find partners</b></span></Link>
						{!isAuthenticated && <Link to="/register" aria-label="Create a BizMatch account"><span className="apple-icon" aria-hidden="true">+</span><span><small>IT STARTS WITH YOU</small><b>Join BizMatch</b></span></Link>}
					</div>
				</div>
			</div>
			<div className="footer-bottom">
				<p>© 2026 BizMatch. All rights reserved.</p>
			</div>
		</div>
	</footer>;
}