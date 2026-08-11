import { Link } from 'react-router-dom';
import './AuthLayout.css';

const panelCopy = {
  login: {
    eyebrow: 'Partner Match',
    headline: (
      <>
        Good partnerships<br />
        start with a <em>good match.</em>
      </>
    ),
    subtitle:
      'Sign back in to pick up your conversations, review new collaboration requests, and keep your network moving.',
    switchLabel: 'New here?',
    switchText: 'Create an account',
    switchTo: '/register',
  },
  register: {
    eyebrow: 'Partner Match',
    headline: (
      <>
        Find the partner<br />
        your business is <em>missing.</em>
      </>
    ),
    subtitle:
      'Set up your profile, tell us what you bring to the table, and start hearing from businesses worth teaming up with.',
    switchLabel: 'Already a member?',
    switchText: 'Sign in',
    switchTo: '/login',
  },
};

// Two orbiting circles with drifting nodes — the "match" forming where they overlap.
function MatchMark() {
  return (
    <svg
      className="match-mark"
      viewBox="0 0 420 420"
      role="img"
      aria-label="Two connected networks overlapping to represent a business match"
    >
      <defs>
        <radialGradient id="overlapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle className="overlap-glow" cx="210" cy="210" r="70" fill="url(#overlapGlow)" />

      <g className="orbit orbit-a">
        <circle cx="160" cy="210" r="118" className="orbit-ring" />
        <circle cx="160" cy="92" r="4.5" className="orbit-node" />
        <circle cx="278" cy="210" r="3.5" className="orbit-node" />
        <circle cx="205" cy="305" r="3" className="orbit-node" />
      </g>

      <g className="orbit orbit-b">
        <circle cx="260" cy="210" r="118" className="orbit-ring orbit-ring-b" />
        <circle cx="260" cy="328" r="4.5" className="orbit-node orbit-node-b" />
        <circle cx="142" cy="210" r="3.5" className="orbit-node orbit-node-b" />
        <circle cx="215" cy="115" r="3" className="orbit-node orbit-node-b" />
      </g>
    </svg>
  );
}

export default function AuthLayout({ mode, formTitle, formIntro, children }) {
  const copy = panelCopy[mode];

  return (
    <div className={`auth-shell auth-mode-${mode}`} key={mode}>
      <div className="auth-grid">
        <aside className="auth-brand-panel">
          <div className="auth-brand-top">
            <span className="auth-eyebrow">{copy.eyebrow}</span>
            <h1 className="auth-headline">{copy.headline}</h1>
            <p className="auth-subtitle">{copy.subtitle}</p>
          </div>

          <MatchMark />

          <div className="auth-brand-bottom">
            <span className="auth-switch-label">{copy.switchLabel}</span>
            <Link to={copy.switchTo} className="auth-switch-link">
              {copy.switchText}
              <span aria-hidden="true" className="auth-switch-arrow">→</span>
            </Link>
          </div>
        </aside>

        <main className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2>{formTitle}</h2>
              <p>{formIntro}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}