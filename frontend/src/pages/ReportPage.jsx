import { useState } from "react";
import { Link } from "react-router-dom";
import { submitReport } from "../DataProvider/SupportDataProvider";
import "./SupportPage.css";

const initialForm = { name: "", email: "", phone: "", reason: "", details: "" };

export default function ReportPage() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setStatus(""); setError("");
    const payload = new FormData(); Object.entries(form).forEach(([key, value]) => payload.append(key, value)); if (file) payload.append("attachment", file);
    try { await submitReport(payload); setForm(initialForm); setFile(null); event.target.reset(); setStatus("Thanks. Your report has been sent to the BizMatch team."); } catch (submissionError) { setError(submissionError.response?.data?.message || "We could not send your report. Please try again."); }
  };
  return <div className="support-page"><main className="support-main"><span className="support-eyebrow">REPORT AN ISSUE</span><div className="support-form-layout"><div><h1>Help us keep BizMatch useful and safe.</h1><p className="support-lead">Report a profile, message, technical problem, or anything that does not feel right. Include as much detail as you can.</p><Link className="support-link" to="/help">Read the help center →</Link></div><form className="support-form" onSubmit={submit}><label>Name<input name="name" value={form.name} onChange={update} required maxLength="100" /></label><label>Email<input name="email" type="email" value={form.email} onChange={update} required maxLength="160" /></label><label>Phone or other contact information<input name="phone" value={form.phone} onChange={update} maxLength="40" /></label><label>Report reason<select name="reason" value={form.reason} onChange={update} required><option value="">Choose a reason</option><option value="harassment">Harassment or unsafe behavior</option><option value="fake-profile">Fake or misleading profile</option><option value="technical">Technical problem</option><option value="content">Inappropriate content</option><option value="other">Something else</option></select></label><label>What happened?<textarea name="details" value={form.details} onChange={update} required maxLength="4000" /></label><label>Attachment (optional)<input type="file" accept="image/*,.pdf,.txt" onChange={(event) => setFile(event.target.files[0] || null)} /></label>{status && <p className="support-status">{status}</p>}{error && <p className="support-error">{error}</p>}<button className="support-submit" type="submit">Send report</button></form></div></main></div>;
}
