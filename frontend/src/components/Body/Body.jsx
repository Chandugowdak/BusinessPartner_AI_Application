import { Button, Tag } from "antd";
import { ArrowRightOutlined, CheckCircleFilled, CompassOutlined, MessageOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const matches = [
  { initials: "AR", name: "Aarav Rao", role: "Product strategist", detail: "Bengaluru, India", color: "gold" },
  { initials: "SM", name: "Sofia Martins", role: "Brand & growth lead", detail: "Lisbon, Portugal", color: "blue" },
  { initials: "JN", name: "Jordan Nguyen", role: "Full-stack builder", detail: "Melbourne, Australia", color: "green" },
];

export default function Body() {
  return <main className="home-main">
    <section className="home-hero" id="discover">
      <div className="home-hero-copy">
        <Tag color="orange" className="home-kicker"><CompassOutlined /> YOUR NEXT CONNECTION</Tag>
        <h1>Build something <em>better</em> together.</h1>
        <p>BizMatch brings ambitious people together around complementary skills, shared values, and ideas worth pursuing.</p>
        <div className="home-hero-actions">
          <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end" href="/find-partners">Explore matches</Button>
          <a href="#how-it-works">See how it works</a>
        </div>
      </div>
      <div className="home-hero-note"><div className="note-icon"><TeamOutlined /></div><strong>Good work starts with the right people.</strong><span>Join a growing network of founders, makers, and collaborators.</span></div>
    </section>
    <section className="matches-section" id="community">
      <div className="section-heading"><div><span className="section-label">CURATED FOR YOU</span><h2>People worth meeting</h2></div><Link to="/find-partners">View all matches <ArrowRightOutlined /></Link></div>
      <div className="match-grid">{matches.map((match) => <article className="match-card" key={match.name}><div className={`match-avatar ${match.color}`}>{match.initials}</div><div className="match-card-content"><h3>{match.name}</h3><p>{match.role}</p><span>{match.detail}</span></div><Link to="/find-partners" className="match-arrow" aria-label={`View ${match.name}`}><ArrowRightOutlined /></Link></article>)}</div>
    </section>
    <section className="home-principles" id="how-it-works"><div><span className="section-label">A BETTER WAY TO CONNECT</span><h2>Less noise. More possibility.</h2></div><div className="principle-list"><div><CheckCircleFilled /><span><strong>Purposeful introductions</strong>Meet people aligned with where you are going.</span></div><div><CheckCircleFilled /><span><strong>Human-first discovery</strong>Find depth beyond a profile and a job title.</span></div><div><MessageOutlined /><span><strong>Conversations that move</strong>Turn a promising match into a practical next step.</span></div></div></section>
  </main>;
}