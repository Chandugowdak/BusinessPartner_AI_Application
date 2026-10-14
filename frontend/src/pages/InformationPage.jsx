import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import {
  ArrowRightOutlined,
  BulbOutlined,
  CompassOutlined,
  HeartOutlined,
  ReloadOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./InformationPage.css";

const aboutValues = [
  {
    icon: TeamOutlined,
    title: "People before profiles",
    text: "A title is only a starting point. Goals, experience, and the way someone wants to work together matter too.",
    details: "BizMatch gives people room to explain what they are building, what they bring, and what kind of collaboration they are looking for. That context can make an introduction more useful than a title or keyword alone.",
  },
  {
    icon: CompassOutlined,
    title: "A clearer way to explore",
    text: "Browse with intention, compare the details that matter, and decide for yourself who feels like a good fit.",
    details: "You stay in control of discovery. Review profiles at your own pace, use search and filters to narrow your options, and reach out only when you have a reason to start a conversation.",
  },
  {
    icon: SafetyCertificateOutlined,
    title: "Trust grows by choice",
    text: "Every introduction starts with a request. You choose when to connect and what to share.",
    details: "Connection requests put both people in control of an introduction. Take time to review a profile, keep sensitive information private, and report anything that does not feel right.",
  },
];

const JOURNAL_TAGS = ["entrepreneurship", "business", "startup"];
const JOURNAL_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

async function fetchJournalFeed(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`The journal service returned ${response.status}.`);
  const articles = await response.json();
  if (!Array.isArray(articles)) throw new Error("The journal service returned an unexpected response.");
  return articles;
}

function getArticleDate(date) {
  if (!date) return "Recently published";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Recently published"
    : parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const content = {
  about: {
    eyebrow: "ABOUT BIZMATCH",
    title: "Good work happens when the right people meet.",
    description: "BizMatch helps founders, professionals, and builders discover potential business partners through shared goals, complementary strengths, and purposeful introductions.",
  },
  blog: {
    eyebrow: "THE BIZMATCH JOURNAL",
    title: "A little guidance for building together.",
    description: "Practical ideas for showing what you bring, meeting potential partners, and turning a first conversation into meaningful progress.",
  },
};

export default function InformationPage({ type }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [journalArticles, setJournalArticles] = useState([]);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const [journalError, setJournalError] = useState("");
  const [journalRefresh, setJournalRefresh] = useState(0);
  const page = content[type] || content.about;
  const isJournal = type === "blog";

  useEffect(() => {
    if (!isJournal) return undefined;

    let isMounted = true;
    const controller = new AbortController();

    const loadJournal = async () => {
      setIsJournalLoading(true);
      setJournalError("");

      try {
        const taggedFeeds = await Promise.allSettled(
          JOURNAL_TAGS.map((tag) => fetchJournalFeed(
            `https://dev.to/api/articles?tag=${tag}&per_page=9`,
            controller.signal
          ))
        );
        const fulfilledFeeds = taggedFeeds
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        if (!fulfilledFeeds.length) {
          throw new Error("We couldn’t reach the article service. Please try again.");
        }

        let articles = fulfilledFeeds.flat();
        if (articles.length < 9) {
          try {
            articles = articles.concat(await fetchJournalFeed(
              "https://dev.to/api/articles?per_page=9",
              controller.signal
            ));
          } catch (error) {
            if (error.name === "AbortError") throw error;
          }
        }

        const uniqueArticles = [...new Map(
          articles
            .filter((article) => article && article.id && article.title && article.url)
            .map((article) => [article.id, article])
        ).values()]
          .sort((first, second) => new Date(second.published_at || 0) - new Date(first.published_at || 0))
          .slice(0, 9);

        if (!uniqueArticles.length) {
          throw new Error("No recent articles are available right now. Please try again.");
        }

        if (isMounted) {
          setJournalArticles(uniqueArticles);
          if (uniqueArticles.length < 9) {
            setJournalError(`Showing ${uniqueArticles.length} recent articles. More will appear as new stories are published.`);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError" && isMounted) {
          setJournalError(error.message || "We couldn’t load the latest articles. Please try again.");
        }
      } finally {
        if (isMounted) setIsJournalLoading(false);
      }
    };

    loadJournal();
    const refreshTimer = window.setInterval(loadJournal, JOURNAL_REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, [isJournal, journalRefresh]);

  return (
    <div className={`information-page${isJournal ? " journal-page" : " about-page"}`}>
      <main>
        <section className="information-hero">
          <div className="information-hero-copy">
            <span className="information-eyebrow">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p className="information-description">{page.description}</p>
            <div className="information-hero-actions">
              <Link to={isJournal ? "/how-matching-works" : "/register"} className="information-primary">
                {isJournal ? "See how matching works" : "Find your people"} <ArrowRightOutlined />
              </Link>
              <a href={isJournal ? "#journal-articles" : "#our-approach"} className="information-secondary">
                {isJournal ? "Browse articles" : "What we believe"} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className={`information-hero-art${isJournal ? " journal-hero-art" : ""}`} aria-hidden="true">
            {isJournal ? (
              <div className="journal-cover">
                <span><ReadOutlined /> BIZMATCH JOURNAL</span>
                <strong>Ideas are<br />better together.</strong>
                <small>NOTES ON PEOPLE, WORK &amp; PARTNERSHIP</small>
                <div className="journal-cover-orbit orbit-one"></div>
                <div className="journal-cover-orbit orbit-two"></div>
              </div>
            ) : (
              <div className="about-connection-model">
                <div className="about-orbit about-orbit-one"></div>
                <div className="about-orbit about-orbit-two"></div>
                <div className="about-person person-one"><TeamOutlined /><span>Your experience</span></div>
                <div className="about-person person-two"><BulbOutlined /><span>New perspective</span></div>
                <div className="about-model-center"><HeartOutlined /><strong>Shared<br />ambition</strong></div>
                <span className="about-model-caption">A good fit makes room for both.</span>
              </div>
            )}
          </div>
        </section>

        {isJournal ? (
          <section className="journal-section" id="journal-articles" aria-labelledby="journal-heading">
            <div className="information-section-heading">
              <div><span className="information-eyebrow">FRESH FROM THE COMMUNITY</span><h2 id="journal-heading">Ideas you can put to work.</h2></div>
              <div className="journal-heading-aside">
                <p>Recent stories from the Dev.to community on startups, business, and building together.</p>
                <button type="button" className="journal-refresh-button" onClick={() => setJournalRefresh((count) => count + 1)} disabled={isJournalLoading}>
                  <ReloadOutlined spin={isJournalLoading} /> {isJournalLoading ? "Updating" : "Refresh articles"}
                </button>
              </div>
            </div>
            <p className="journal-source-note">Community articles from Dev.to · refreshed daily and whenever you choose</p>
            {journalError && <div className={`journal-feed-status${journalArticles.length ? " is-notice" : " is-error"}`} role={journalArticles.length ? "status" : "alert"}>
              <span>{journalError}</span>
              {!journalArticles.length && <button type="button" onClick={() => setJournalRefresh((count) => count + 1)}>Try again</button>}
            </div>}
            {isJournalLoading && !journalArticles.length ? (
              <div className="journal-grid" aria-label="Loading recent articles" aria-busy="true">
                {Array.from({ length: 9 }, (_, index) => <div className="journal-card journal-skeleton" key={index}><div className="journal-card-art"></div><div className="journal-card-content"><span></span><span></span><span></span></div></div>)}
              </div>
            ) : journalArticles.length ? (
              <div className="journal-grid">
              {journalArticles.map((article, index) => (
                <article className="journal-card" key={article.title}>
                  <div className={`journal-card-art journal-art-${(index % 3) + 1}${article.cover_image ? " has-cover" : ""}`} aria-hidden="true">
                    {article.cover_image ? <img src={article.cover_image} alt="" loading="lazy" /> : <ReadOutlined />}
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="journal-card-content">
                    <div className="journal-card-meta"><span>{article.tag_list?.[0] || "Community story"}</span><span>{getArticleDate(article.published_at)}</span></div>
                    <h3>{article.title}</h3>
                    <p>{article.description || "A recent story from the Dev.to community."}</p>
                    <div className="journal-card-footer"><span>By {article.user?.name || article.user?.username || "Dev.to author"} · {article.reading_time_minutes || 1} min read</span>
                      <a className="information-read-link" href={article.url} target="_blank" rel="noopener noreferrer">Read story <ArrowRightOutlined /></a>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            ) : null}
          </section>
        ) : (
          <>
            <section className="about-intro-section" id="our-approach">
              <div className="about-intro-heading"><span className="information-eyebrow">OUR APPROACH</span><h2>Partnership starts with understanding what matters to you.</h2></div>
              <p>Finding a business partner is about more than filling a role. It is about finding someone whose perspective, experience, and ambitions make the work stronger. BizMatch gives you a thoughtful place to discover those possibilities and start the conversation on your terms.</p>
            </section>
            <section className="about-values-section" aria-labelledby="about-values-heading">
              <div className="information-section-heading">
                <div><span className="information-eyebrow">BUILT AROUND PEOPLE</span><h2 id="about-values-heading">A more human way to connect.</h2></div>
                <p>Explore what guides the experience, then decide whether BizMatch feels right for you.</p>
              </div>
              <div className="about-values-grid">
                {aboutValues.map((value, index) => {
                  const ValueIcon = value.icon;
                  return <button className="about-value-card" type="button" key={value.title} onClick={() => setSelectedItem(value)}>
                    <span className="about-value-icon"><ValueIcon /></span>
                    <span className="about-value-number">0{index + 1}</span>
                    <strong>{value.title}</strong>
                    <span className="about-value-text">{value.text}</span>
                    <span className="information-read-link">Explore our approach <ArrowRightOutlined /></span>
                  </button>;
                })}
              </div>
            </section>
            <section className="about-next-step">
              <div><span className="information-eyebrow">START WITH A CONVERSATION</span><h2>Your next collaboration could begin here.</h2><p>Create a profile, share what you are looking for, and explore people who are building toward something similar.</p></div>
              <Link to="/register" className="information-primary">Create your profile <ArrowRightOutlined /></Link>
            </section>
          </>
        )}
      </main>
      <Modal
        open={Boolean(selectedItem)}
        onCancel={() => setSelectedItem(null)}
        footer={null}
        centered
        destroyOnClose
        title={selectedItem?.title}
        className="information-modal"
      >
        <p className="information-modal-summary">{selectedItem?.text}</p>
        <p>{selectedItem?.details}</p>
        <Button type="primary" onClick={() => setSelectedItem(null)}>Got it</Button>
      </Modal>
    </div>
  );
}
