import { useEffect, useMemo, useState } from "react";
import { CheckCircleFilled, MessageOutlined, SearchOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Spin } from "antd";
import { io } from "socket.io-client";
import { getConnections, getConversation, sendMessage } from "../DataProvider/AuthDataProvider";
import "./ConnectionsPage.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
const getAvatarHue = (name = "") => [...name].reduce((hue, character) => hue + character.charCodeAt(0), 0) % 360;
const updateConnectionMessage = (connections, connectionId, message) => connections.map((connection) =>
  String(connection._id) === String(connectionId) ? { ...connection, lastMessage: message } : connection
);
const getLastMessagePreview = (connection, currentUserId) => {
  const message = connection.lastMessage;
  if (!message?.body) return connection.user.role || "Start a conversation";
  return String(message.sender?._id || message.sender) === String(currentUserId) ? `You: ${message.body}` : message.body;
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
const formatTime = (date) => date ? new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

function ChatAvatar({ person, className = "" }) {
  return <div className={`chat-avatar ${className}`} style={{ "--avatar-hue": getAvatarHue(person?.name) }}>
    {person?.photoUrl ? <img src={person.photoUrl} alt="" /> : person?.name ? getInitials(person.name) : <UserOutlined />}
  </div>;
}

export default function ConnectionsPage() {
  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "{}"); } catch { return {}; }
  }, []);
  const [connections, setConnections] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const visibleConnections = useMemo(() => connections.filter((connection) => {
    const query = search.trim().toLocaleLowerCase();
    return !query || [connection.user.name, connection.user.role, connection.lastMessage?.body].some((value) => value?.toLocaleLowerCase().includes(query));
  }), [connections, search]);

  useEffect(() => {
    getConnections().then((data) => {
      const nextConnections = (data.connections || []).filter((connection) => connection?._id && connection.user);
      setConnections(nextConnections);
      if (nextConnections.length) setSelected(nextConnections[0]);
    }).catch((error) => {
      setLoadError(error?.response?.data?.message || "Could not load connections. Please try again.");
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const nextSocket = io("http://localhost:5000", { auth: { token: localStorage.getItem("token") }, autoConnect: true });
    setSocket(nextSocket);
    return () => nextSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    let current = true;
    setIsConversationLoading(true);
    getConversation(selected._id).then((data) => {
      if (current) setMessages(data.messages || []);
    }).catch(() => { if (current) setMessages([]); }).finally(() => { if (current) setIsConversationLoading(false); });
    const joinConversation = () => socket.emit("join-conversation", selected._id);
    if (socket?.connected) joinConversation();
    socket?.on("connect", joinConversation);
    const handleMessage = (message) => {
      if (String(message.connection) === String(selected._id)) setMessages((currentMessages) => [...currentMessages, message]);
      setConnections((currentConnections) => updateConnectionMessage(currentConnections, message.connection, message));
    };
    socket?.on("new-message", handleMessage);
    return () => { current = false; socket?.off("connect", joinConversation); socket?.off("new-message", handleMessage); };
  }, [selected, socket]);

  const handleSend = async (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selected) return;
    setDraft("");
    if (socket?.connected) {
      socket.emit("send-message", { connectionId: selected._id, body }, (result) => {
        if (result?.error) setDraft(body);
      });
    } else {
      try {
        const data = await sendMessage(selected._id, body);
        setMessages((current) => [...current, data.message]);
        setConnections((current) => updateConnectionMessage(current, selected._id, data.message));
      } catch { setDraft(body); }
    }
  };

  return (
    <main className="connections-workspace">
      <header className="connections-intro">
        <h1>Conversations</h1>
        <p>Pick up where you left off with your business connections.</p>
      </header>
      {loadError ? <Alert className="connections-alert" type="error" showIcon message="Could not load connections" description={loadError} /> : isLoading ? <div className="connections-loading"><Spin /></div> : <div className="connections-shell">
          <aside className="connections-sidebar" aria-label="Inbox">
            <div className="connections-sidebar-heading">
              <ChatAvatar person={profile} className="current-user-avatar" />
              <div className="current-user-identity"><strong>{profile.name || "Your account"}</strong><span>Your messages</span></div>
            </div>
            <Input className="connections-search" value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder="Search messages" allowClear aria-label="Search messages" />
            <div className="chat-list">{visibleConnections.map((connection) => <button type="button" className={`chat-list-item${selected?._id === connection._id ? " selected" : ""}`} key={connection._id} onClick={() => setSelected(connection)} aria-current={selected?._id === connection._id ? "true" : undefined}>
              <ChatAvatar person={connection.user} />
              <div className="chat-list-copy"><strong>{connection.user.name || "Business partner"}</strong><span>{getLastMessagePreview(connection, profile._id)}</span></div>
              <div className="chat-list-meta">
                <time dateTime={connection.lastMessage?.createdAt}>{formatTime(connection.lastMessage?.createdAt)}</time>
                <time dateTime={connection.lastMessage?.createdAt}>{formatDate(connection.lastMessage?.createdAt)}</time>
              </div>
            </button>)}</div>
            {!visibleConnections.length && <div className="chat-empty"><MessageOutlined /><p>{connections.length ? "No conversations match your search." : "Your conversations will appear here."}</p></div>}
          </aside>
          <section className="conversation-panel" aria-label="Chat conversation">
            {selected ? <>
              <header className="conversation-header"><ChatAvatar person={selected.user} /><div className="conversation-person"><h2>{selected.user.name || "Business partner"}</h2><span>{selected.user.role || "Connected"}</span></div><span className="conversation-status"><CheckCircleFilled /> Available</span></header>
              <div className="conversation-messages" aria-live="polite">
                {isConversationLoading ? <div className="conversation-loading"><Spin /></div> : messages.length ? messages.map((message, index) => <div className={`chat-bubble-row${String(message.sender?._id || message.sender) === String(profile._id) ? " mine" : ""}`} key={message._id || `${message.createdAt}-${index}`}><div className="chat-bubble">{message.body}<time>{formatTime(message.createdAt)}</time></div></div>) : <div className="messages-empty"><span><MessageOutlined /></span><p>No messages yet. Say hello to get started.</p></div>}
              </div>
              <form className="message-composer" onSubmit={handleSend}><Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." maxLength={2000} aria-label="Message" /><Button type="primary" htmlType="submit" icon={<SendOutlined />} disabled={!draft.trim()} aria-label="Send message" /></form>
            </> : <div className="conversation-placeholder"><span className="placeholder-mark"><MessageOutlined /></span><strong>{connections.length ? "Choose a conversation" : "No conversations yet"}</strong><span>{connections.length ? "Select someone from your messages." : "Your accepted connections will appear here."}</span></div>}
          </section>
        </div>}
    </main>
  );
}
