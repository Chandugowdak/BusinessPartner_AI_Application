import { useState } from "react";
import { App as AntApp, Button, Modal, Select } from "antd";
import { ArrowRightOutlined, CheckCircleOutlined, CloseCircleOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { submitContact } from "../DataProvider/SupportDataProvider";
import "./SupportPage.css";

const helpTopics = [
  { title: "Your profile", category: "Get started", text: "Add your skills, experience, goals, and location so BizMatch can make more useful introductions.", details: ["Complete each profile section with specific skills and experience.", "Add a clear photo and a short description of the work you want to do.", "Review your profile after every major change to keep your matches relevant."] },
  { title: "Finding partners", category: "Discover", text: "Browse suggested partners, review their profiles, and send a connection request when there is a good fit.", details: ["Use filters to narrow results by industry, location, and partnership goals.", "Open a profile to compare experience, interests, and availability.", "Include a personal note with each request so the other person knows why you reached out."] },
  { title: "Connections", category: "Collaborate", text: "Use your connections workspace to accept requests, start conversations, and keep collaboration moving.", details: ["Accept or decline requests from the My Requests page.", "Use the conversation panel to share context before scheduling a call.", "Keep important project details in the conversation so both partners have a clear record."] },
  { title: "Account safety", category: "Stay secure", text: "Never share passwords or payment details. Report suspicious behavior so our team can review it.", details: ["BizMatch will never ask for your password in a message.", "Report profiles that request payment or pressure you for personal information.", "Use a unique password and sign out when using a shared device."] },
  { title: "Summons and notices", category: "Stay informed", text: "Official account or service notices are sent through your registered contact details and the BizMatch application.", details: ["Check the notification bell for connection and message activity.", "Keep your email address current so important account notices reach you.", "Contact support if a notice looks unexpected or asks for sensitive information."] },
  { title: "Need more help?", category: "Talk to us", text: "Tell us what happened and our support team will help you find the next step.", details: ["Share the page you were using and what you expected to happen.", "Include screenshots or error text when it is safe to do so.", "Our team will reply using the contact details in your message."] },
];

export default function HelpPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification } = AntApp.useApp();

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContact(form);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      notification.success({ message: "Message sent", description: "The BizMatch team will get back to you soon." });
    } catch (error) {
      notification.error({ message: "Message not sent", description: error.response?.data?.message || "Please try again in a moment." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="support-page"><main className="support-main container-fluid"><div className="support-hero row align-items-end"><div className="col-lg-8"><span className="support-eyebrow">BIZMATCH HELP CENTER</span><h1>Useful answers for building better connections.</h1><p className="support-lead">Find practical guidance for your profile, partner discovery, conversations, and account safety.</p></div><div className="col-lg-4 support-hero-note"><span>QUICK SUPPORT</span><strong>Explore a topic or send us a note.</strong></div></div>
    <section aria-labelledby="help-topics-title" className="support-topics"><div className="support-section-heading"><div><span className="support-eyebrow">START HERE</span><h2 id="help-topics-title">What can we help with?</h2></div><span className="support-topic-count">{helpTopics.length} guides</span></div><div className="support-grid row">{helpTopics.map((topic, index) => <div className="col-md-6 col-xl-4" key={topic.title}><button type="button" className="support-card" onClick={() => setSelectedTopic(topic)}><span className="support-card-number">0{index + 1}</span><span className="support-card-category">{topic.category}</span><h3>{topic.title}</h3><p>{topic.text}</p><span className="support-card-action">Read guide <ArrowRightOutlined /></span></button></div>)}</div></section>
    <section className="support-contact row" aria-labelledby="support-contact-title"><div className="col-lg-5 support-contact-intro"><span className="support-eyebrow">STILL STUCK?</span><h2 id="support-contact-title">Let’s find the next step together.</h2><p>Send the details once and our support team will help you move forward.</p><Link className="support-link" to="/contact">Open the full contact page <ArrowRightOutlined /></Link></div><form className="support-form col-lg-7" onSubmit={submit}><div className="support-form-heading"><span className="support-form-icon"><MailOutlined /></span><div><h3>Contact the team</h3><p>We usually reply within one business day.</p></div></div><div className="row g-3"><label className="col-md-6">Name<input name="name" value={form.name} onChange={update} required maxLength="100" autoComplete="name" /></label><label className="col-md-6">Email<input name="email" type="email" value={form.email} onChange={update} required maxLength="160" autoComplete="email" /></label><label className="col-md-6">Phone or other contact information<input name="phone" value={form.phone} onChange={update} maxLength="40" autoComplete="tel" /></label><label className="col-md-6">Topic<Select className="support-select" value={form.subject || undefined} placeholder="Choose a topic" onChange={(value) => setForm({ ...form, subject: value })} options={helpTopics.map((topic) => ({ label: topic.title, value: topic.title }))} /></label><label className="col-12">Message<textarea name="message" value={form.message} onChange={update} required maxLength="4000" /></label></div><Button className="support-submit" htmlType="submit" type="primary" loading={isSubmitting}>Send message <ArrowRightOutlined /></Button></form></section>
  </main><Modal open={Boolean(selectedTopic)} onCancel={() => setSelectedTopic(null)} footer={null} centered destroyOnClose title={selectedTopic?.title} closeIcon={<CloseCircleOutlined />} className="support-modal"><p className="support-modal-intro">{selectedTopic?.text}</p><ul>{selectedTopic?.details.map((detail) => <li key={detail}><CheckCircleOutlined />{detail}</li>)}</ul><Button type="primary" onClick={() => { setSelectedTopic(null); document.getElementById("support-contact-title")?.scrollIntoView({ behavior: "smooth" }); }}>Contact support <ArrowRightOutlined /></Button></Modal></div>;
}
