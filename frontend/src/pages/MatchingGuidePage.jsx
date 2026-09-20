import { Link } from "react-router-dom";
import "./InformationPage.css";

const steps = [
  ["01", "Complete your profile", "Share your role, professional field, strengths, and goals so BizMatch can understand what you bring to a partnership."],
  ["02", "Explore compatible people", "Browse professionals whose experience and ambitions complement your own. Use search and role filters to narrow the list."],
  ["03", "Start with a connection request", "When you find a promising partner, send a request. You can cancel a pending request before it is accepted."],
  ["04", "Build the relationship", "Once both people accept, the connection appears in My Connections, where you can start a private conversation."],
];

export default function MatchingGuidePage() {
  return (
    <div className="information-page">
      <main className="information-main matching-guide-main">
        <span className="workspace-eyebrow">HOW BIZMATCH WORKS</span>
        <h1>Find the right people to build with.</h1>
        <p className="information-description">BizMatch turns shared goals and complementary skills into useful professional connections.</p>
        <div className="information-points matching-guide-points">
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div><strong>{title}</strong><p>{description}</p></div>
            </article>
          ))}
        </div>
        <Link to={localStorage.getItem("token") ? "/find-partners" : "/register"} className="information-back">Start finding partners <span>→</span></Link>
      </main>
    </div>
  );
}
