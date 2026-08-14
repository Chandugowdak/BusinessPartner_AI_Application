import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  GlobalOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import LoginForm from "../pages/LoginPage.jsx";
import RegisterForm from "../pages/RegisterPage.jsx";
import logo from "../assets/bizmatch-logo.png"; // <-- put your logo file here
import "./AuthPage.css";

const { Title, Text } = Typography;

const COPY = {
  login: {
    eyebrow: "WELCOME BACK",
    heading: (
      <>
        Find the right
        <br />
        <span>partner today.</span>
      </>
    ),
    body: "Connect with the right people, share your ambition, and build a stronger future together.",
    bullets: [
      "Discover partners with complementary skills",
      "Connect with people near your location",
      "Build meaningful professional relationships",
    ],
    cardEyebrow: "WELCOME BACK",
    cardTitle: "Sign in to BizMatch",
    cardSubtitle:
      "Continue where you left off and discover your next opportunity.",
  },

  register: {
    eyebrow: "START YOUR JOURNEY",
    heading: (
      <>
        Right partner.
        <br />
        <span>Stronger future.</span>
      </>
    ),
    body: "BizMatch helps founders, entrepreneurs and professionals find the right people to turn ideas into reality.",
    bullets: [
      "Find complementary skills for your venture",
      "Discover collaboration opportunities",
      "Grow your professional network",
    ],
    cardEyebrow: "GET STARTED",
    cardTitle: "Create your account",
    cardSubtitle:
      "Tell us about yourself and we'll help you find better matches.",
  },
};

function MatchGraphic() {
  return (
    <div className="match-graphic">
      <div className="match-line" />

      <div className="match-node">
        <TeamOutlined />
      </div>

      <div className="match-center">
        <ArrowRightOutlined />
      </div>

      <div className="match-node">
        <GlobalOutlined />
      </div>
    </div>
  );
}

export default function AuthPage({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();

  const copy = COPY[mode];

  // Keep internal mode in sync if the route changes the initialMode
  // (e.g. browser back/forward between /login and /register).
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Every time the mode changes (i.e. every "page" switch), snap to the
  // top instead of letting the browser keep whatever scroll position the
  // previous page was at. This is what makes mobile feel like a real page
  // navigation instead of scrolling within one long page.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [mode]);

  const handleModeChange = (next) => {
    setMode(next);
    navigate(`/${next}`, { replace: true });
  };

  return (
    <div className="auth-page">

      {/* =================================
          DESKTOP LEFT BRANDING
          (hidden entirely on mobile/small via CSS)
      ================================= */}
      <section className="brand-panel">

        <div className="brand-glow glow-one" />
        <div className="brand-glow glow-two" />

        <div className="brand-content">

          {/* Logo */}
          <div className="brand-logo">
            <img src={logo} alt="BizMatch" className="brand-logo-icon" />
            <div className="brand-name-block">
              <div className="brand-name">
                Biz<span>Match</span>
              </div>
              <div className="brand-tagline">
                Right Partner. Stronger Future.
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              {copy.eyebrow}
            </div>

            <Title className="hero-title">
              {copy.heading}
            </Title>

            <Text className="hero-description">
              {copy.body}
            </Text>

            <MatchGraphic />

            <div className="hero-features">
              {copy.bullets.map((item) => (
                <div className="hero-feature" key={item}>
                  <CheckCircleFilled className="feature-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Trust */}
          <div className="brand-bottom">

            <div className="trust-item">
              <SafetyCertificateOutlined />

              <div>
                <strong>Trusted</strong>
                <span>Connections</span>
              </div>
            </div>

            <div className="trust-item">
              <GlobalOutlined />

              <div>
                <strong>Global</strong>
                <span>Opportunities</span>
              </div>
            </div>

            <div className="trust-item">
              <TeamOutlined />

              <div>
                <strong>Growing</strong>
                <span>Community</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =================================
          RIGHT AUTH SECTION
          (this is the ONLY thing shown on mobile/small)
      ================================= */}
      <section className="auth-panel">

        {/* =================================
            MOBILE LOGO — stacked: logo image on top,
            wordmark + tagline underneath, all centered.
            Hidden on desktop via CSS.
        ================================= */}
        <div className="mobile-brand">
          <img src={logo} alt="BizMatch" className="mobile-brand-icon" />
          <div className="mobile-brand-name">
            Biz<span>Match</span>
          </div>
          <div className="mobile-brand-tagline">
            Right Partner. Stronger Future.
          </div>
        </div>


        <div className="auth-wrapper">

          {/* =================================
              DESKTOP SWITCH (hidden on mobile)
          ================================= */}
          <div className="desktop-auth-switch">

            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => handleModeChange("login")}
            >
              Sign in
            </button>

            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => handleModeChange("register")}
            >
              Create account
            </button>

          </div>


          {/* =================================
              AUTH CARD
          ================================= */}
          <div className="auth-card">

            <div className="card-top-line" />

            <div className="auth-card-header">

              <div className="card-eyebrow">
                {copy.cardEyebrow}
              </div>

              <Title level={2} className="card-title">
                {copy.cardTitle}
              </Title>

              <Text className="card-subtitle">
                {copy.cardSubtitle}
              </Text>

            </div>


            {/* Form: key={mode} forces a fresh mount so old form state
                never bleeds into the new one, on desktop or mobile. */}
            <div
              key={mode}
              className="auth-form-wrapper"
            >

              {mode === "login" ? (
                <LoginForm
                  onSwitchToRegister={() =>
                    handleModeChange("register")
                  }
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() =>
                    handleModeChange("login")
                  }
                />
              )}

            </div>


            {/* =================================
                MOBILE SWITCH — this is the link mobile
                users tap; it routes to a fresh page via
                handleModeChange (navigate + scroll reset)
                instead of feeling like an in-page swap.
            ================================= */}
            <div className="mobile-auth-switch">

              {mode === "login" ? (
                <>
                  <span>Don't have an account?</span>

                  <button
                    onClick={() =>
                      handleModeChange("register")
                    }
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>

                  <button
                    onClick={() =>
                      handleModeChange("login")
                    }
                  >
                    Sign in
                  </button>
                </>
              )}

            </div>

          </div>


          {/* Footer */}
          <div className="auth-footer">
            © 2026 BizMatch
            <span>•</span>
            Right Partner. Stronger Future.
          </div>

        </div>

      </section>

    </div>
  );
}