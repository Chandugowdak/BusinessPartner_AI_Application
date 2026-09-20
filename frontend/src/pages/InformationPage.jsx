import { Link } from "react-router-dom";
import "./InformationPage.css";

const content = {
  about: {
    eyebrow: "ABOUT BIZMATCH",
    title: "Better partnerships start with better introductions.",
    description: "BizMatch helps founders, professionals, and builders find people whose skills and ambitions complement their own.",
    points: ["Discover people beyond job titles", "Build trust through purposeful conversations", "Turn promising connections into practical collaboration"],
  },
  blog: {
    eyebrow: "THE BIZMATCH JOURNAL",
    title: "Ideas for building together.",
    description: "We are preparing practical notes on partnerships, professional communities, and the habits that make collaboration work.",
    points: ["How to describe what you can offer", "Questions that make first conversations useful", "Creating partnerships that last beyond the introduction"],
  },
};

export default function InformationPage({ type }) {
  const page = content[type];
  return <div className="information-page"><main className="information-main"><span className="workspace-eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p className="information-description">{page.description}</p><div className="information-points">{page.points.map((point, index) => <article key={point}><span>0{index + 1}</span><strong>{point}</strong></article>)}</div><Link to="/login" className="information-back">Explore BizMatch <span>→</span></Link></main></div>;
}
