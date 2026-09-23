import { Alert, Button, Input, Modal, Select, Spin, Tag } from "antd";
import { BulbOutlined, CheckCircleOutlined, ClockCircleOutlined, EnvironmentOutlined, LinkOutlined, PlusOutlined, RocketOutlined, SearchOutlined, TeamOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { cancelConnectionRequest, getConnections, getUsers, sendConnectionRequest } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";
import "./FindPartnersPage.css";

const roles = ["Founder", "Investor", "Mentor", "Professional", "Freelancer", "Student", "Other"];
const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function FindPartnersPage() {
  const profile = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const profileId = String(profile._id || profile.id || "");
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [requestedIds, setRequestedIds] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [connectNotice, setConnectNotice] = useState(null);
  const canConnect = (profile.profileCompletion || 20) >= 75;
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    getUsers({ search, role }).then((response) => {
      if (isCurrent) setPartners(response.users || []);
    }).catch(() => {
      if (isCurrent) setPartners([]);
    }).finally(() => {
      if (isCurrent) setIsLoading(false);
    });
    return () => { isCurrent = false; };
  }, [search, role]);
  useEffect(() => {
    getConnections().then((response) => {
      const requests = response.requests || [];
      setRequestedIds(requests.filter((request) => String(request.requestedBy) === profileId && request.status === "pending" && request.user?._id).map((request) => ({ userId: String(request.user._id), connectionId: request._id })));
      const latestCooldown = requests.find((request) => String(request.requestedBy) === profileId && request.cooldownUntil && new Date(request.cooldownUntil) > new Date());
      setCooldownUntil(latestCooldown?.cooldownUntil || null);
    }).catch(() => {});
  }, [profileId]);
  const handleRequest = async () => {
    if (!selectedPartner) return;
    try {
      setRequestingId(selectedPartner._id);
      const response = await sendConnectionRequest(selectedPartner._id);
      setRequestedIds((current) => [...current, { userId: String(selectedPartner._id), connectionId: response?.connectionId }]);
      setIsModalOpen(false);
    } catch (error) {
      setConnectNotice({ title: "A little more time", message: error?.response?.data?.message || "Could not send connection request.", retryAt: error?.response?.data?.retryAt });
    } finally {
      setRequestingId(null);
    }
  };
  const openConnect = (partner) => {
    if (!canConnect) {
      setConnectNotice({ title: "Finish your profile first", message: "Complete at least 75% of your profile before sending a connection request." });
      return;
    }
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };
  const pendingCount = requestedIds.length;
  const profileCount = partners.length;
  const roleCount = new Set(partners.map((partner) => partner.role).filter(Boolean)).size;
  const handleCancel = async (userId) => {
    const request = requestedIds.find((item) => String(item.userId) === String(userId))?.connectionId;
    if (!request) return;
    try {
      setRequestingId(userId);
      await cancelConnectionRequest(request);
      setRequestedIds((current) => current.filter((item) => item.userId !== userId));
    } catch (error) {
      window.alert(error?.response?.data?.message || "Could not cancel connection request.");
    } finally { setRequestingId(null); }
  };
  return (
    <WorkspacePage eyebrow="DISCOVER PEOPLE" title="Find your next partner" description="Build a trusted network with people whose skills, goals, and experience complement your own." action="My requests">
      {!canConnect && <Alert type="warning" showIcon message="Complete at least 75% of your profile to send connection requests." description="You can still browse recommendations while your verification is pending." />}
      <div className="find-partners-intro"><div><span className="find-partners-kicker"><TeamOutlined /> NETWORK DIRECTORY</span><h2>People worth knowing</h2><p>Search by name, role, or professional focus. A thoughtful introduction is the start of every strong partnership.</p></div><div className="find-partners-count"><strong>{partners.length}</strong><span>profiles found</span></div></div>
      <section className="discovery-pulse" aria-label="Discovery summary"><div className="pulse-heading"><div><span className="find-partners-kicker"><RocketOutlined /> YOUR DISCOVERY PULSE</span><h2>Make every introduction count</h2></div><span className="pulse-status"><CheckCircleOutlined /> {cooldownUntil ? "Cooldown active" : "Live directory"}</span></div><div className="pulse-metrics"><div><strong>{profileCount}</strong><span>people in view</span></div><div><strong>{roleCount}</strong><span>career paths</span></div><div><strong>{pendingCount}</strong><span>active requests</span></div></div></section>
      <div className="partner-filters"><Input value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder="Search people, roles, or expertise" allowClear /><Select value={role || undefined} onChange={setRole} placeholder="All roles" allowClear options={roles.map((item) => ({ value: item, label: item }))} /></div>
      {isLoading ? <div className="partner-loading"><Spin /></div> : <section className="partner-grid" aria-label="Suggested partners">
        {partners.map((partner) => (
          <article className="partner-profile" key={partner._id}>
            <div className="partner-avatar">{partner.photoUrl ? <img src={partner.photoUrl} alt="" /> : getInitials(partner.name)}</div>
            <div className="partner-profile-main">
              <div className="partner-profile-heading"><div><h2>{partner.name}</h2><p>{partner.role || "Business professional"}</p></div><button className="icon-action" aria-label={`View ${partner.name}'s profile`}><LinkOutlined /></button></div>
              <span className="partner-location"><EnvironmentOutlined /> {partner.professionalField || "Open to new connections"}</span>
              <div className="partner-tags">{[partner.role, partner.professionalField].filter(Boolean).map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
              <div className="partner-fit"><BulbOutlined /> Complementary perspective</div>
              {requestedIds.some((item) => String(item.userId) === String(partner._id)) ? <><div className="request-pending"><ClockCircleOutlined /> Request pending</div><Button danger block loading={String(requestingId) === String(partner._id)} onClick={() => handleCancel(partner._id)}>Withdraw request</Button></> : <Button type="primary" block icon={<PlusOutlined />} loading={String(requestingId) === String(partner._id)} onClick={() => openConnect(partner)}>Connect</Button>}
            </div>
          </article>
        ))}
        {!partners.length && <div className="partner-empty">No partners match those filters.</div>}
      </section>}
      <section className="partner-playbook"><div><span className="find-partners-kicker"><UsergroupAddOutlined /> A BETTER FIRST MOVE</span><h2>Three signals to look for</h2><p>Good partnerships begin with a shared direction and a useful difference.</p></div><div className="playbook-grid"><article><span>01</span><h3>Shared momentum</h3><p>Look for someone building toward a goal you understand.</p></article><article><span>02</span><h3>Useful contrast</h3><p>Different experience can turn a familiar idea into a stronger one.</p></article><article><span>03</span><h3>Easy next step</h3><p>Start with one specific question instead of a broad hello.</p></article></div></section>
      <Modal title="Send connection request" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={[<Button key="cancel" onClick={() => setIsModalOpen(false)}>Keep browsing</Button>, <Button key="send" type="primary" loading={requestingId === selectedPartner?._id} onClick={handleRequest}>Send request</Button>]}>
        <div className="connect-modal-copy"><div className="partner-avatar">{selectedPartner?.photoUrl ? <img src={selectedPartner.photoUrl} alt="" /> : getInitials(selectedPartner?.name)}</div><p>You are sending a connection request to <strong>{selectedPartner?.name}</strong>. Requests expire automatically after 7 days, and you can withdraw it any time before they respond.</p></div>
      </Modal>
      <Modal title={connectNotice?.title} open={Boolean(connectNotice)} onCancel={() => setConnectNotice(null)} footer={<Button type="primary" onClick={() => setConnectNotice(null)}>Understood</Button>}><p className="connect-notice-copy">{connectNotice?.message}</p>{connectNotice?.retryAt ? <p className="connect-notice-time"><ClockCircleOutlined /> Available {new Date(connectNotice.retryAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p> : null}</Modal>
    </WorkspacePage>
  );
}
