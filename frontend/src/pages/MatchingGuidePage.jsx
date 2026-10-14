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
  const destination = localStorage.getItem("token") ? "/find-partners" : "/register";

  const handleStepKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % steps.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + steps.length) % steps.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = steps.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setActiveStep(nextIndex);
    document.getElementById(`matching-step-${nextIndex}`)?.focus();
  };

  return (
    <div className="matching-page">
      <main>
        <section className="matching-hero">
          <div className="matching-hero-copy">
            <span className="matching-eyebrow"><CompassOutlined /> A MORE THOUGHTFUL WAY TO CONNECT</span>
            <h1>Meet the people<br />who <em>move you forward.</em></h1>
            <p>From your first profile to a promising collaboration, BizMatch gives you a clear path to find people whose goals and strengths complement your own.</p>
            <div className="matching-hero-actions">
              <Link to={destination} className="matching-primary-button">Start your journey <ArrowRightOutlined /></Link>
              <a className="matching-text-link" href="#matching-journey">See how it works <span aria-hidden="true">↓</span></a>
            </div>
            <div className="matching-hero-proof">
              <span><CheckCircleFilled /> You stay in control</span>
              <span><SafetyCertificateOutlined /> Introductions by choice</span>
            </div>
          </div>
          <div className="matching-hero-visual" aria-label="A visual model of complementary partner qualities">
            <div className="matching-visual-heading"><span>THE RIGHT FIT</span><strong>More than a shared title.</strong></div>
            <div className="matching-hero-model">
            <div className="model-ring ring-outer"></div><div className="model-ring ring-inner"></div>
              <div className="model-core"><SafetyCertificateOutlined /><strong>Human fit</strong><span>Built around you</span></div>
              <span className="model-chip chip-goals">Shared goals</span><span className="model-chip chip-skills">Strengths</span><span className="model-chip chip-style">Work style</span>
            </div>
            <div className="matching-visual-footer"><span>01 — CONTEXT</span><span>02 — COMPLEMENT</span><span>03 — CONNECTION</span></div>
          </div>
        </section>

        <section className="matching-flow" id="matching-journey" aria-labelledby="matching-journey-title">
          <div className="matching-flow-intro">
            <div><span className="matching-eyebrow">A SIMPLE, FOUR-STEP JOURNEY</span><h2 id="matching-journey-title">From first hello to what’s next.</h2></div>
            <p>Good partnerships take time. Start with one clear step, then build from there.</p>
          </div>
          <div className="matching-layout">
            <div className="matching-step-tabs" role="tablist" aria-label="Matching steps">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <button
                    className={`matching-step-tab${index === activeStep ? " active" : ""}`}
                    id={`matching-step-${index}`}
                    key={step.number}
                    type="button"
                    role="tab"
                    aria-selected={index === activeStep}
                    aria-controls="matching-step-panel"
                    tabIndex={index === activeStep ? 0 : -1}
                    onClick={() => setActiveStep(index)}
                    onKeyDown={(event) => handleStepKeyDown(event, index)}
                  >
                    <span className="step-tab-number">{step.number}</span>
                    <span className="step-tab-icon"><StepIcon /></span>
                    <span className="step-tab-copy"><strong>{step.title}</strong><small>{step.short}</small></span>
                    <ArrowRightOutlined className="step-tab-arrow" />
                  </button>
                );
              })}
            </div>
            <article className="matching-step-detail" id="matching-step-panel" role="tabpanel" aria-labelledby={`matching-step-${activeStep}`} key={selectedStep.number}>
              <div className="detail-topline"><span className="detail-icon"><SelectedIcon /></span><span className="detail-number">YOUR JOURNEY <b>{selectedStep.number}</b> / 04</span></div>
              <h3>{selectedStep.title}</h3>
              <p className="detail-description">{selectedStep.description}</p>
              <div className="detail-note"><CheckCircleFilled /> <span>{selectedStep.detail}</span></div>
              <Link to={activeStep === 3 && localStorage.getItem("token") ? "/connections" : destination}>{selectedStep.action} <ArrowRightOutlined /></Link>
              <div className="detail-progress" aria-label={`Step ${activeStep + 1} of ${steps.length}`}>
                {steps.map((step, index) => <span className={index <= activeStep ? "complete" : ""} key={step.number}></span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="matching-signals">
          <div className="matching-signals-heading"><span className="matching-eyebrow">WHAT MAKES A GOOD MATCH</span><h2>Compatibility is more than a shared industry.</h2><p>Every partnership is different. We help you look beyond labels and notice the context that can make working together click.</p><Link to="/register" className="matching-secondary-link">Tell us what you’re looking for <ArrowRightOutlined /></Link></div>
          <div className="signal-model">
            <div className="signal-model-header"><span>THE OVERLAP</span><span>WHAT TO LOOK FOR</span></div>
            <div className="signal-model-top"><div className="signal-avatar avatar-you">You</div><div className="signal-connector"><span>Shared context</span></div><div className="signal-avatar avatar-them">A partner</div></div>
            <div className="signal-list">{matchSignals.map(([title, text, score]) => <div className="signal-row" key={title}><div className="signal-row-copy"><strong>{title}</strong><p>{text}</p></div><div className="signal-score" aria-hidden="true"><span style={{ width: score }}></span></div><b>{title === "Shared direction" ? "ALIGN" : title === "Complementary strengths" ? "BALANCE" : "RHYTHM"}</b></div>)}</div>
            <p className="signal-model-footnote">A useful starting point for a conversation — not a promise or a score.</p>
          </div>
        </section>

        <section className="matching-bottom-cta"><div><span className="matching-eyebrow">READY WHEN YOU ARE</span><h2>Your next great collaboration can start with one profile.</h2><p>Share what matters to you, then explore at your own pace.</p></div><Link to={destination} className="matching-primary-button">Continue to BizMatch <ArrowRightOutlined /></Link></section>
      </main>
    </div>
  );
}
