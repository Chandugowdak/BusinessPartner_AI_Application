import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined, SendOutlined, SortAscendingOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, Input, Pagination, Select, Spin, Tabs, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { acceptConnection, cancelConnectionRequest, getConnections, rejectConnection } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";
import "./MyRequestsPage.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
const pageSizeOptions = [6, 12, 24];
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [workingId, setWorkingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  const loadRecords = async () => {
    try {
      const response = await getConnections();
      setRecords({ requests: response.requests || [], connections: response.connections || [] });
      setLoadError("");
    } catch (error) {
      setLoadError(error?.response?.data?.message || "Could not load your requests. Please try again.");
    }
  };
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

  const items = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return groups[activeTab].filter((item) => {
      const person = item.user || {};
      return !query || [person.name, person.role, person.professionalField, person.email].some((value) => value?.toLocaleLowerCase().includes(query));
    }).sort((first, second) => {
      if (sort === "name") return (first.user?.name || "").localeCompare(second.user?.name || "");
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
  }, [groups, activeTab, search, sort]);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const refreshRecords = async () => {
    setIsRefreshing(true);
    await loadRecords();
    setIsRefreshing(false);
  };
  const changeTab = (nextTab) => { setActiveTab(nextTab); setPage(1); };
  const tabDescriptions = {
    sent: "Invitations you have sent and can still withdraw.",
    invited: "People waiting for your reply.",
    accepted: "Your active business connections.",
    rejected: "Requests that have been closed.",
  };
  return <WorkspacePage eyebrow="YOUR NETWORK" title="My requests" description="Track every invitation and connection in one clear workspace.">
    <section className="request-overview" aria-label="Request activity overview">
      <div className="request-overview-copy"><span>Request activity</span><p>A clear view of every introduction, from first invite to active connection.</p></div>
      <div className="request-overview-stats">
        <div><strong>{groups.invited.length}</strong><span>Needs your reply</span></div>
        <div><strong>{groups.sent.length}</strong><span>Awaiting reply</span></div>
        <div><strong>{groups.accepted.length}</strong><span>Connections</span></div>
        <div><strong>{groups.rejected.length}</strong><span>Closed</span></div>
      </div>
    </section>
    {isLoading ? <div className="partner-loading"><Spin /></div> : <>
      {loadError && <Alert className="request-load-error" type="error" showIcon message={loadError} action={<Button size="small" onClick={refreshRecords}>Try again</Button>} />}
      <Tabs className="request-tabs" activeKey={activeTab} onChange={changeTab} items={tabs.map((tab) => ({ ...tab, label: <span>{tab.icon}<span>{tab.label}</span><b>{groups[tab.key].length}</b></span> }))} />
      <div className="request-toolbar">
        <div className="request-current-copy"><strong>{tabs.find((tab) => tab.key === activeTab)?.label}</strong><span>{tabDescriptions[activeTab]}</span></div>
        <div className="request-controls">
          <Input className="request-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} prefix={<SearchOutlined />} placeholder="Search people" allowClear aria-label="Search requests" />
          <Select className="request-sort" value={sort} onChange={(value) => { setSort(value); setPage(1); }} suffixIcon={<SortAscendingOutlined />} aria-label="Sort requests" options={[{ value: "newest", label: "Newest first" }, { value: "name", label: "Name A-Z" }]} />
          <Button className="request-refresh" icon={<ReloadOutlined />} loading={isRefreshing} onClick={refreshRecords} aria-label="Refresh requests" title="Refresh requests" />
        </div>
      </div>
      <section className="request-card-grid" aria-label={`${activeTab} requests`} aria-live="polite">
        {!pageItems.length ? <div className="request-empty"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={search ? `No matches for “${search}”.` : activeTab === "sent" ? "No sent requests yet" : activeTab === "invited" ? "No invitations waiting for you" : activeTab === "accepted" ? "No accepted connections yet" : "No rejected requests"} /></div> : pageItems.map((item) => <PersonCard key={item._id} item={item} mode={activeTab} workingId={workingId} onAction={updateRequest} />)}
      </section>
      {items.length > 0 && <div className="request-pagination"><Pagination current={currentPage} pageSize={pageSize} total={items.length} showSizeChanger pageSizeOptions={pageSizeOptions.map(String)} showTotal={(total, range) => `${range[0]}–${range[1]} of ${total}`} onChange={(nextPage, nextPageSize) => { setPage(nextPage); setPageSize(nextPageSize); }} /></div>}
      {activeTab === "invited" && items.length ? <Alert className="request-help" type="info" showIcon icon={<UserAddOutlined />} message="Review the profile details before accepting an invitation." /> : null}
    </>}
  </WorkspacePage>;
}
