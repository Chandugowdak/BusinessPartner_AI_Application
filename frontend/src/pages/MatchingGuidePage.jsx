import { Link } from "react-router-dom";
import { ArrowRightOutlined, CheckCircleFilled, CompassOutlined, FileTextOutlined, MessageOutlined, SafetyCertificateOutlined, TeamOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./MatchingGuidePage.css";

const steps = [
  { number: "01", icon: FileTextOutlined, title: "Build your signal", short: "Start with your goals", description: "Share the work you do, the challenge you are solving, and the kind of collaborator who would make progress easier.", detail: "A thoughtful profile gives the matching model better context than a job title alone.", action: "Complete your profile" },
  { number: "02", icon: CompassOutlined, title: "Discover your fit", short: "See relevant people", description: "BizMatch surfaces people with complementary skills, aligned ambitions, and working styles that can make a partnership practical.", detail: "Use roles, search, and professional fields to move from broad discovery to a focused shortlist.", action: "Explore partners" },
  { number: "03", icon: MessageOutlined, title: "Make the first move", short: "Open with intention", description: "Send a connection request when someone feels promising. A clear reason for reaching out makes the first conversation easier.", detail: "Pending requests stay in your control, so you can cancel them before they are accepted.", action: "Find a partner" },
  { number: "04", icon: TeamOutlined, title: "Build momentum", short: "Turn fit into progress", description: "Once both people accept, the connection moves into your private workspace where the real partnership can begin.", detail: "Keep the conversation focused on one useful next step and let trust grow from there.", action: "View connections" },
];

const matchSignals = [
  ["Shared direction", "Your goals and their goals point toward a useful overlap.", "82%"],
  ["Complementary strengths", "Different experience creates more room to contribute.", "74%"],
  ["Working rhythm", "Compatible expectations make collaboration easier to sustain.", "68%"],
];

export default function MatchingGuidePage() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = steps[activeStep];
  const SelectedIcon = selectedStep.icon;

  return (
    <div className="matching-page">
      <main>
        <section className="matching-hero">
          <div className="matching-hero-copy">
            <span className="matching-eyebrow"><CompassOutlined /> THE BIZMATCH METHOD</span>
            <h1>Less searching.<br /><em>More finding.</em></h1>
            <p>Partnerships become powerful when the right goals, strengths, and working rhythms meet. Here is how BizMatch helps you get there.</p>
            <Link to={localStorage.getItem("token") ? "/find-partners" : "/register"} className="matching-primary-button">Start finding partners <ArrowRightOutlined /></Link>
          </div>
          <div className="matching-hero-model" aria-label="BizMatch matching model">
            <div className="model-ring ring-outer"></div><div className="model-ring ring-inner"></div>
            <div className="model-core"><SafetyCertificateOutlined /><strong>Human fit</strong><span>Powered by context</span></div>
            <span className="model-chip chip-goals">Goals</span><span className="model-chip chip-skills">Skills</span><span className="model-chip chip-style">Style</span>
          </div>
        </section>

        <section className="matching-flow" aria-label="How the matching process works">
          <div className="matching-flow-intro"><span className="matching-eyebrow">A FOUR-STEP JOURNEY</span><h2>From profile to partnership.</h2><p>Select a step to see what happens next.</p></div>
          <div className="matching-layout">
            <div className="matching-step-tabs" role="tablist" aria-label="Matching steps">
              {steps.map((step, index) => { const StepIcon = step.icon; return <button className={`matching-step-tab ${index === activeStep ? "active" : ""}`} key={step.number} role="tab" aria-selected={index === activeStep} onClick={() => setActiveStep(index)}><span>{step.number}</span><StepIcon /><strong>{step.title}</strong><small>{step.short}</small><ArrowRightOutlined /></button>; })}
            </div>
            <article className="matching-step-detail" key={selectedStep.number}>
              <div className="detail-icon"><SelectedIcon /></div><span className="detail-number">STEP {selectedStep.number}</span><h3>{selectedStep.title}</h3><p>{selectedStep.description}</p><div className="detail-note"><CheckCircleFilled /> {selectedStep.detail}</div><Link to={activeStep === 3 ? "/connections" : "/find-partners"}>{selectedStep.action} <ArrowRightOutlined /></Link>
            </article>
          </div>
        </section>

        <section className="matching-signals">
          <div className="matching-signals-heading"><span className="matching-eyebrow">WHAT MAKES A GOOD MATCH</span><h2>Compatibility is more than a shared industry.</h2><p>Our model looks for the overlap that helps two people do meaningful work together.</p></div>
          <div className="signal-model"><div className="signal-model-top"><div className="signal-avatar avatar-you">You</div><div className="signal-connector"><span>Shared context</span></div><div className="signal-avatar avatar-them">Them</div></div><div className="signal-list">{matchSignals.map(([title, text, score]) => <div className="signal-row" key={title}><div><strong>{title}</strong><p>{text}</p></div><div className="signal-score"><span style={{ width: score }}></span></div><b>{score}</b></div>)}</div></div>
        </section>

        <section className="matching-bottom-cta"><div><span className="matching-eyebrow">READY WHEN YOU ARE</span><h2>Your next great collaboration can start with one profile.</h2></div><Link to={localStorage.getItem("token") ? "/find-partners" : "/register"} className="matching-primary-button">Continue to BizMatch <ArrowRightOutlined /></Link></section>
      </main>
    </div>
  );
}
