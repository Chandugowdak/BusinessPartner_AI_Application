import { useEffect, useMemo, useState } from "react";
import { CheckCircleFilled, SendOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { io } from "socket.io-client";
import WorkspacePage from "./WorkspacePage";
import { getConnections, getConversation, sendMessage } from "../DataProvider/AuthDataProvider";
import FriendRequests from "../components/FriendRequests/FriendRequests";
import "./ConnectionsPage.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
const formatTime = (date) => date ? new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

export default function ConnectionsPage() {
  const profile = useMemo(() => JSON.parse(localStorage.getItem("currentUser") || "{}"), []);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    getConnections().then((data) => {
      setConnections(data.connections || []);
      setRequests(data.requests || []);
      if (data.connections?.length) setSelected(data.connections[0]);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const nextSocket = io("http://localhost:5000", { auth: { token: localStorage.getItem("token") } });
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
    socket?.emit("join-conversation", selected._id);
    const handleMessage = (message) => {
      if (String(message.connection) === String(selected._id)) setMessages((currentMessages) => [...currentMessages, message]);
    };
    socket?.on("new-message", handleMessage);
    return () => { current = false; socket?.off("new-message", handleMessage); };
  }, [selected, socket]);

  const handleAccepted = (connection) => { setRequests((current) => current.filter((request) => request._id !== connection._id)); setConnections((current) => [...current, connection]); setSelected(connection); };
  const handleRejected = (connectionId) => setRequests((current) => current.filter((request) => request._id !== connectionId));

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
      } catch { setDraft(body); }
    }
  };

  return (
    <WorkspacePage eyebrow="YOUR NETWORK" title="My connections" description="Pick a connection to continue the conversation.">
      {isLoading ? <div className="partner-loading"><Spin /></div> : <div className="connections-shell">
        <aside className="connections-sidebar" aria-label="Connections">
          <div className="connections-sidebar-heading"><strong>Chats</strong><span>{connections.length}</span></div>
          <FriendRequests requests={requests} currentUserId={profile._id} onAccepted={handleAccepted} onRejected={handleRejected} />
          <div className="chat-list">{connections.map((connection) => <button className={`chat-list-item${selected?._id === connection._id ? " selected" : ""}`} key={connection._id} onClick={() => setSelected(connection)}><div className="chat-avatar">{connection.user.photoUrl ? <img src={connection.user.photoUrl} alt="" /> : getInitials(connection.user.name)}</div><div className="chat-list-copy"><strong>{connection.user.name}</strong><span>{connection.lastMessage?.body || connection.user.role || "Connected"}</span></div><time>{formatTime(connection.lastMessage?.createdAt)}</time></button>)}</div>
          {!connections.length && !requests.length && <p className="chat-empty">Accepted connections will appear here.</p>}
        </aside>
        <section className="conversation-panel" aria-label="Conversation">
          {selected ? <><header className="conversation-header"><div className="chat-avatar">{selected.user.photoUrl ? <img src={selected.user.photoUrl} alt="" /> : getInitials(selected.user.name)}</div><div><h2>{selected.user.name}</h2><span>{selected.user.role || "Business partner"}</span></div><CheckCircleFilled /></header><div className="conversation-messages">{isConversationLoading ? <Spin /> : messages.map((message) => <div className={`chat-bubble-row${String(message.sender?._id || message.sender) === String(profile._id) ? " mine" : ""}`} key={message._id}><div className="chat-bubble">{message.body}<time>{formatTime(message.createdAt)}</time></div></div>)}</div><form className="message-composer" onSubmit={handleSend}><Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." maxLength={2000} /><Button type="primary" htmlType="submit" icon={<SendOutlined />} disabled={!draft.trim()} aria-label="Send message" /></form></> : <div className="conversation-placeholder"><strong>Your conversations</strong><span>Select an accepted connection to start chatting.</span></div>}
        </section>
      </div>}
    </WorkspacePage>
  );
}
