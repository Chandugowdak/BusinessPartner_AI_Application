import { Link } from "react-router-dom";
import "./SupportPage.css";

const helpTopics = [
  { title: "Your profile", text: "Add your skills, experience, goals, and location so BizMatch can make more useful introductions." },
  { title: "Finding partners", text: "Browse suggested partners, review their profiles, and send a connection request when there is a good fit." },
  { title: "Connections", text: "Use your connections workspace to accept requests, start conversations, and keep collaboration moving." },
  { title: "Account safety", text: "Never share passwords or payment details. Report suspicious behavior so our team can review it." },
  { title: "Summons and notices", text: "Official account or service notices are sent through your registered contact details and the BizMatch application." },
  { title: "Need more help?", text: "Tell us what happened and our support team will help you find the next step." },
];

export default function HelpPage() {
  return <div className="support-page"><main className="support-main"><span className="support-eyebrow">BIZMATCH HELP CENTER</span><h1>Useful answers for building better connections.</h1><p className="support-lead">Find practical guidance for your profile, partner discovery, conversations, and account safety.</p><div className="support-grid">{helpTopics.map((topic) => <article className="support-card" key={topic.title}><h2>{topic.title}</h2><p>{topic.text}</p></article>)}</div><Link className="support-link" to="/contact">Contact the BizMatch team →</Link></main></div>;
}
