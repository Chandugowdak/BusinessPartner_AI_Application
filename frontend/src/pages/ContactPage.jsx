import { useState } from "react";
import { submitContact } from "../DataProvider/SupportDataProvider";
import "./SupportPage.css";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setStatus(""); setError("");
    try { await submitContact(form); setForm(initialForm); setStatus("Your message is with the BizMatch team. We will get back to you soon."); } catch (submissionError) { setError(submissionError.response?.data?.message || "We could not send your message. Please try again."); }
  };
  return <div className="support-page"><main className="support-main"><span className="support-eyebrow">CONTACT BIZMATCH</span><div className="support-form-layout"><div><h1>Tell us what you need.</h1><p className="support-lead">Questions about your account, partnerships, or the product? Send us a message and include the best way to reach you.</p></div><form className="support-form" onSubmit={submit}><label>Name<input name="name" value={form.name} onChange={update} required maxLength="100" /></label><label>Email<input name="email" type="email" value={form.email} onChange={update} required maxLength="160" /></label><label>Phone or other contact information<input name="phone" value={form.phone} onChange={update} maxLength="40" /></label><label>Subject<input name="subject" value={form.subject} onChange={update} required maxLength="160" /></label><label>Message<textarea name="message" value={form.message} onChange={update} required maxLength="4000" /></label>{status && <p className="support-status">{status}</p>}{error && <p className="support-error">{error}</p>}<button className="support-submit" type="submit">Send message</button></form></div></main></div>;
}
