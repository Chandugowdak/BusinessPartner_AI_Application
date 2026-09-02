import { MessageOutlined } from "@ant-design/icons";
import WorkspacePage from "./WorkspacePage";

const messages = [
  { initials: "MK", name: "Maya Kapoor", preview: "I would love to hear more about the idea you mentioned.", time: "9:42 AM", unread: true, tone: "gold" },
  { initials: "DL", name: "Daniel Lee", preview: "Thanks for connecting. Let us find a time to chat.", time: "Yesterday", unread: false, tone: "blue" },
  { initials: "NS", name: "Nora Singh", preview: "Your profile stood out to me because of the research work.", time: "Monday", unread: false, tone: "green" },
];

export default function MessagesPage() {
  return (
    <WorkspacePage eyebrow="INBOX" title="Messages" description="A focused place for thoughtful introductions and ongoing conversations.">
      <section className="workspace-list" aria-label="Messages">
        {messages.map((message) => <article className={`workspace-row message-row${message.unread ? " unread" : ""}`} key={message.name}><div className={`partner-avatar ${message.tone}`}>{message.initials}</div><div className="workspace-row-copy"><h2>{message.name}</h2><p>{message.preview}</p></div><div className="message-meta"><span>{message.time}</span>{message.unread ? <strong>1</strong> : <MessageOutlined />}</div></article>)}
      </section>
    </WorkspacePage>
  );
}
