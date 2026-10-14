import "./SupportPage.css";

const sections = [
  ["Information you choose to share", "BizMatch stores the profile information you provide, including your name, email, skills, location, professional interests, and profile photo. You can update these details from your profile."],
  ["How we use information", "We use your information to operate your account, suggest relevant business partners, support conversations, send important service notices, and improve the safety and usefulness of BizMatch."],
  ["What we do not do", "We do not sell your personal information. We only share information when it is needed to provide the service, comply with the law, protect users, or when you ask us to do so."],
  ["Your choices", "You can review and update your profile, choose what to include, request help with your account, or ask us to remove your information by contacting the BizMatch team."],
  ["Security and retention", "We use access controls and reasonable technical safeguards to protect account data. We keep information only as long as it is needed for the purposes described here or required by law."],
  ["Policy updates", "When this policy changes, we will update this page and the effective date. Continued use of BizMatch after an update means you have reviewed the revised policy."],
];

export default function PrivacyPolicyPage() {
  return <div className="support-page"><main className="support-main"><span className="support-eyebrow">BIZMATCH PRIVACY</span><h1>Your information should work for you.</h1><p className="support-lead">This policy explains what BizMatch collects, why we use it, and the choices you have. Last updated September 20, 2026.</p><div className="privacy-sections">{sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</div></main></div>;
}
