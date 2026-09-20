import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined, ClockCircleOutlined, SendOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, Spin, Tabs, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { acceptConnection, cancelConnectionRequest, getConnections, rejectConnection } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";
import "./MyRequestsPage.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
const tabs = [
  { key: "sent", label: "Sent requests", icon: <SendOutlined /> },
  { key: "invited", label: "Invited requests", icon: <UserAddOutlined /> },
  { key: "accepted", label: "Accepted", icon: <CheckCircleOutlined /> },
  { key: "rejected", label: "Rejected", icon: <CloseCircleOutlined /> },
];

function PersonCard({ item, mode, workingId, onAction }) {
  const person = item.user || {};
  const action = mode === "sent" ? { label: "Cancel request", icon: <CloseOutlined />, type: "cancel" } : mode === "invited" ? { label: "Accept invitation", icon: <CheckOutlined />, type: "accept" } : null;
  return <article className="request-profile-card">
    <div className="request-profile-top"><div className="request-avatar request-profile-avatar">{person.photoUrl ? <img src={person.photoUrl} alt={person.name} /> : getInitials(person.name)}</div><div className="request-profile-heading"><h2>{person.name || "BizMatch member"}</h2><p>{person.role || "Business professional"}</p></div><Tag className={`request-status-tag ${mode}`}>{mode === "sent" ? "Pending" : mode === "invited" ? "Needs your reply" : mode}</Tag></div>
    <div className="request-profile-details"><span>{person.professionalField || "Open to opportunities"}</span><span>{person.email || "Email hidden"}</span>{person.phone && <span>{person.phone}</span>}</div>
    <div className="request-profile-footer"><span><ClockCircleOutlined /> {person.profileCompletion || 0}% profile complete</span>{action ? <div className="request-card-actions"><Button type={action.type === "accept" ? "primary" : "default"} danger={action.type === "cancel"} icon={action.icon} loading={workingId === item._id} onClick={() => onAction(item, action.type)}>{action.label}</Button>{mode === "invited" && <Button icon={<CloseOutlined />} disabled={workingId === item._id} onClick={() => onAction(item, "reject")}>Decline</Button>}</div> : mode === "accepted" ? <span className="request-positive"><CheckCircleOutlined /> Connected</span> : <span className="request-muted"><CloseCircleOutlined /> Closed request</span>}</div>
  </article>;
}

export default function MyRequestsPage() {
  const profile = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [records, setRecords] = useState({ requests: [], connections: [] });
  const [activeTab, setActiveTab] = useState("sent");
  const [isLoading, setIsLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  const loadRecords = () => getConnections().then((response) => setRecords({ requests: response.requests || [], connections: response.connections || [] })).catch(() => setRecords({ requests: [], connections: [] }));
  useEffect(() => { loadRecords().finally(() => setIsLoading(false)); }, []);

  const groups = useMemo(() => ({
    sent: records.requests.filter((request) => String(request.requestedBy) === String(profile._id) && request.status === "pending"),
    invited: records.requests.filter((request) => String(request.requestedBy) !== String(profile._id) && request.status === "pending"),
    accepted: records.connections,
    rejected: records.requests.filter((request) => request.status === "rejected"),
  }), [records, profile._id]);

  const updateRequest = async (request, action) => {
    try {
      setWorkingId(request._id);
      if (action === "accept") await acceptConnection(request._id);
      if (action === "reject") await rejectConnection(request._id);
      if (action === "cancel") await cancelConnectionRequest(request._id);
      await loadRecords();
      if (action === "accept") setActiveTab("accepted");
    } catch (error) {
      window.alert(error?.response?.data?.message || `Could not ${action} this request.`);
    } finally { setWorkingId(null); }
  };

  const items = groups[activeTab];
  return <WorkspacePage eyebrow="YOUR NETWORK" title="My requests" description="Track every invitation and connection in one clear workspace.">
    {isLoading ? <div className="partner-loading"><Spin /></div> : <>
      <Tabs className="request-tabs" activeKey={activeTab} onChange={setActiveTab} items={tabs.map((tab) => ({ ...tab, label: <span>{tab.icon} {tab.label} <b>{groups[tab.key].length}</b></span> }))} />
      <section className="request-card-grid" aria-label={`${activeTab} requests`}>
        {!items.length ? <div className="request-empty"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={activeTab === "sent" ? "No sent requests yet" : activeTab === "invited" ? "No invitations waiting for you" : activeTab === "accepted" ? "No accepted connections yet" : "No rejected requests"} /></div> : items.map((item) => <PersonCard key={item._id} item={item} mode={activeTab} workingId={workingId} onAction={updateRequest} />)}
      </section>
      {activeTab === "invited" && items.length ? <Alert className="request-help" type="info" showIcon icon={<UserAddOutlined />} message="Review the profile details before accepting an invitation." /> : null}
    </>}
  </WorkspacePage>;
}
