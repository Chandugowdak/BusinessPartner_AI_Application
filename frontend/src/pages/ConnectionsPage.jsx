import { useEffect, useMemo, useState } from "react";
import { CheckCircleFilled, GlobalOutlined, MessageOutlined, SearchOutlined, SendOutlined, TeamOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Spin } from "antd";
import { io } from "socket.io-client";
import WorkspacePage from "./WorkspacePage";
import { getConnections, getConversation, sendMessage } from "../DataProvider/AuthDataProvider";
import "./ConnectionsPage.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
const copy = {
  en: {
    eyebrow: "YOUR NETWORK", title: "My connections", description: "Good conversations make good partnerships. Pick up where you left off.",
    language: "Language", chats: "Your people", connected: "connected", search: "Search connections", noMatches: "No connections match your search.",
    emptyList: "Your accepted connections will show up here.", conversation: "Conversation", onlineNetwork: "PRIVATE NETWORK", ready: "Ready to talk",
    connectedPartner: "Business partner", choose: "A good conversation starts here", chooseHint: "Choose a connection to catch up, share an idea, or plan your next move.",
    noMessages: "No messages yet. Start with a hello.", loadingError: "Could not load connections", loadFallback: "Could not load connections. Please try again.",
    messagePlaceholder: "Write a message...", send: "Send", messageLabel: "Message", languageEnglish: "English", languageSpanish: "Español",
  },
  es: {
    eyebrow: "TU RED", title: "Mis conexiones", description: "Las buenas conversaciones crean grandes alianzas. Continúa donde lo dejaste.",
    language: "Idioma", chats: "Tu red", connected: "conectados", search: "Buscar conexiones", noMatches: "No hay conexiones que coincidan con tu búsqueda.",
    emptyList: "Tus conexiones aceptadas aparecerán aquí.", conversation: "Conversación", onlineNetwork: "RED PRIVADA", ready: "Listo para conversar",
    connectedPartner: "Socio profesional", choose: "Una buena conversación empieza aquí", chooseHint: "Elige una conexión para ponerte al día, compartir una idea o planear el siguiente paso.",
    noMessages: "Aún no hay mensajes. Saluda para empezar.", loadingError: "No se pudieron cargar las conexiones", loadFallback: "No se pudieron cargar las conexiones. Inténtalo de nuevo.",
    messagePlaceholder: "Escribe un mensaje...", send: "Enviar", messageLabel: "Mensaje", languageEnglish: "English", languageSpanish: "Español",
  },
};

const formatTime = (date, locale) => date ? new Date(date).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" }) : "";

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
  const [language, setLanguage] = useState(() => localStorage.getItem("connections-language") === "es" ? "es" : "en");
  const [isLoading, setIsLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const t = copy[language];
  const locale = language === "es" ? "es-ES" : "en-US";
  const visibleConnections = useMemo(() => connections.filter((connection) => {
    const query = search.trim().toLocaleLowerCase(locale);
    return !query || [connection.user.name, connection.user.role, connection.lastMessage?.body].some((value) => value?.toLocaleLowerCase(locale).includes(query));
  }), [connections, locale, search]);

  useEffect(() => {
    getConnections().then((data) => {
      const nextConnections = (data.connections || []).filter((connection) => connection?._id && connection.user);
      setConnections(nextConnections);
      if (nextConnections.length) setSelected(nextConnections[0]);
    }).catch((error) => {
      setLoadError(error?.response?.data?.message || copy.en.loadFallback);
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
      } catch { setDraft(body); }
    }
  };

  const changeLanguage = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    localStorage.setItem("connections-language", nextLanguage);
  };

  return (
    <WorkspacePage eyebrow={t.eyebrow} title={t.title} description={t.description}>
      <div className="connections-page" lang={language}>
        <div className="connections-toolbar">
          <div className="connections-network-note"><span className="connections-network-icon"><TeamOutlined /></span><div><strong>{t.onlineNetwork}</strong><span>{connections.length} {t.connected}</span></div></div>
          <label className="connections-language"><GlobalOutlined /><span className="visually-hidden">{t.language}</span><select value={language} onChange={changeLanguage} aria-label={t.language}><option value="en">{t.languageEnglish}</option><option value="es">{t.languageSpanish}</option></select></label>
        </div>
        {loadError ? <Alert className="connections-alert" type="error" showIcon message={t.loadingError} description={loadError} /> : isLoading ? <div className="connections-loading"><Spin /></div> : <div className="connections-shell">
          <aside className="connections-sidebar" aria-label={t.chats}>
            <div className="connections-sidebar-heading"><div><span>{t.chats}</span><strong>{connections.length}</strong></div><p>{connections.length} {t.connected}</p></div>
            <Input className="connections-search" value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder={t.search} allowClear aria-label={t.search} />
            <div className="chat-list">{visibleConnections.map((connection) => <button type="button" className={`chat-list-item${selected?._id === connection._id ? " selected" : ""}`} key={connection._id} onClick={() => setSelected(connection)} aria-current={selected?._id === connection._id ? "true" : undefined}>
              <div className="chat-avatar">{connection.user.photoUrl ? <img src={connection.user.photoUrl} alt={connection.user.name || ""} /> : getInitials(connection.user.name)}</div>
              <div className="chat-list-copy"><strong>{connection.user.name}</strong><span>{connection.lastMessage?.body || connection.user.role || t.connectedPartner}</span></div>
              <time>{formatTime(connection.lastMessage?.createdAt, locale)}</time>
            </button>)}</div>
            {!visibleConnections.length && <div className="chat-empty"><TeamOutlined /><p>{connections.length ? t.noMatches : t.emptyList}</p></div>}
          </aside>
          <section className="conversation-panel" aria-label={t.conversation}>
            {selected ? <>
              <header className="conversation-header"><div className="chat-avatar">{selected.user.photoUrl ? <img src={selected.user.photoUrl} alt={selected.user.name || ""} /> : getInitials(selected.user.name)}</div><div className="conversation-person"><h2>{selected.user.name}</h2><span>{selected.user.role || t.connectedPartner}</span></div><span className="conversation-status"><CheckCircleFilled /> {t.ready}</span></header>
              <div className="conversation-messages" aria-live="polite">
                {isConversationLoading ? <div className="conversation-loading"><Spin /></div> : messages.length ? messages.map((message, index) => <div className={`chat-bubble-row${String(message.sender?._id || message.sender) === String(profile._id) ? " mine" : ""}`} key={message._id || `${message.createdAt}-${index}`}><div className="chat-bubble">{message.body}<time>{formatTime(message.createdAt, locale)}</time></div></div>) : <div className="messages-empty"><span><MessageOutlined /></span><p>{t.noMessages}</p></div>}
              </div>
              <form className="message-composer" onSubmit={handleSend}><Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t.messagePlaceholder} maxLength={2000} aria-label={t.messageLabel} /><Button type="primary" htmlType="submit" icon={<SendOutlined />} disabled={!draft.trim()} aria-label={t.send}>{t.send}</Button></form>
            </> : <div className="conversation-placeholder"><span className="placeholder-mark"><MessageOutlined /></span><strong>{t.choose}</strong><span>{connections.length ? t.chooseHint : t.emptyList}</span></div>}
          </section>
        </div>}
      </div>
    </WorkspacePage>
  );
}
