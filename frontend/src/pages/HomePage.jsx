import { ArrowRightOutlined, CheckCircleFilled, CompassOutlined, LinkedinFilled, PlayCircleFilled, RiseOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HomePage.css";

const achievements = [
	{ value: "12k+", label: "active professionals" },
	{ value: "4.8/5", label: "member experience" },
	{ value: "86%", label: "find a relevant match" },
];

const testimonials = [
	{ quote: "BizMatch helped me find the product partner I had been looking for without spending months networking.", name: "Priya Shah", role: "Co-founder, Northstar Labs", initials: "PS" },
	{ quote: "The conversations start with purpose. I met someone who understood both the challenge and the opportunity.", name: "Daniel Kim", role: "Independent growth advisor", initials: "DK" },
];

export default function HomePage() {
	let firstName = "there";
	try { firstName = JSON.parse(localStorage.getItem("currentUser") || "{}").name?.split(" ")[0] || "there"; } catch { }

	return <div className="home-page">
		<main>
			<section className="home-hero">
				<div className="home-hero-inner">
					<div className="home-hero-copy">
						<div className="home-eyebrow"><CompassOutlined /> BUSINESS PARTNERSHIP, REIMAGINED</div>
						<h1>Find the person who makes your <span>next move</span> possible.</h1>
						<p>Welcome back, {firstName}. BizMatch connects ambitious founders, operators, and specialists around shared goals and complementary strengths.</p>
						<div className="home-hero-actions">
							<Link className="home-primary-button" to="/find-partners">Show matches <ArrowRightOutlined /></Link>
							<Link className="home-secondary-link" to="/how-matching-works"><PlayCircleFilled /> See how it works</Link>
						</div>
						<div className="home-trust-line"><span className="trust-avatars"><i>AM</i><i>SK</i><i>JR</i><i>+</i></span><span>Join 12,000+ people building what is next.</span></div>
					</div>
					<div className="home-hero-art" aria-label="A network of compatible business partners">
						<div className="hero-art-orbit orbit-one"></div><div className="hero-art-orbit orbit-two"></div>
						<div className="hero-art-center"><TeamOutlined /><strong>Better together</strong><span>Find your signal in the noise</span></div>
						<div className="hero-art-card card-top"><b>Purpose</b><span>Aligned goals</span><RiseOutlined /></div>
						<div className="hero-art-card card-right"><b>Skills</b><span>Complementary</span><CheckCircleFilled /></div>
						<div className="hero-art-card card-bottom"><b>Momentum</b><span>Ready to build</span><ArrowRightOutlined /></div>
					</div>
				</div>
			</section>

			<section className="home-achievements" aria-label="BizMatch achievements">
				{achievements.map((item) => <div className="achievement" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
				<div className="achievement-note"><RiseOutlined /> Growing with intention since 2021</div>
			</section>

			<section className="home-section home-process" id="how-it-works">
				<div className="section-intro"><span className="home-eyebrow">A CLEARER WAY FORWARD</span><h2>Good partnerships are designed, not left to chance.</h2><p>Skip the awkward cold start. We help you move from a shared ambition to a useful first conversation.</p></div>
				<div className="process-list">
					<div className="process-item"><span>01</span><div><h3>Tell us where you are going</h3><p>Share your goals, experience, and the kind of collaborator who would add real value.</p></div></div>
					<div className="process-item"><span>02</span><div><h3>See meaningful matches</h3><p>Explore people selected for complementary skills, values, and working styles.</p></div></div>
					<div className="process-item"><span>03</span><div><h3>Start with a better question</h3><p>Send a thoughtful introduction and turn potential into a focused conversation.</p></div></div>
				</div>
			</section>

			<section className="home-section home-testimonials">
				<div className="section-heading"><div><span className="home-eyebrow">FROM THE COMMUNITY</span><h2>Built for the work behind the work.</h2></div><Link to="/find-partners">Meet the community <ArrowRightOutlined /></Link></div>
				<div className="testimonial-grid">{testimonials.map((testimonial) => <article className="testimonial" key={testimonial.name}><div className="quote-mark">“</div><blockquote>{testimonial.quote}</blockquote><div className="testimonial-person"><span>{testimonial.initials}</span><div><strong>{testimonial.name}</strong><small>{testimonial.role}</small></div></div></article>)}</div>
			</section>

			<section className="home-founder">
				<div className="founder-portrait"><div className="portrait-initials">MK</div><span className="portrait-badge"><CheckCircleFilled /> Founder</span></div>
				<div className="founder-copy"><span className="home-eyebrow">WHY BIZMATCH EXISTS</span><h2>“The right partner changes what feels possible.”</h2><p>BizMatch was founded by Maya Kapoor after seeing too many talented people build alone. The platform is designed around a simple belief: when ambition meets the right complement, progress gets lighter and more rewarding.</p><div className="founder-meta"><strong>Maya Kapoor</strong><span>Founder &amp; CEO, BizMatch</span><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="Maya Kapoor on LinkedIn"><LinkedinFilled /></a></div></div>
			</section>

			<section className="home-final-cta"><div><span className="home-eyebrow">YOUR NEXT CHAPTER</span><h2>There is more to build with the right person.</h2></div><Link className="home-primary-button" to="/find-partners">Show matches <ArrowRightOutlined /></Link></section>
		</main>
	</div>;
}