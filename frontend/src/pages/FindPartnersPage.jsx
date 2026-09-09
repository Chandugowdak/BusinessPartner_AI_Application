import { Alert, Button, Input, Select, Spin, Tag } from "antd";
import { EnvironmentOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getUsers, sendConnectionRequest } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";

const roles = ["Founder", "Investor", "Mentor", "Professional", "Freelancer", "Student", "Other"];
const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function FindPartnersPage() {
  const profile = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [requestedIds, setRequestedIds] = useState([]);
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
  const handleRequest = async (userId) => {
    try {
      setRequestingId(userId);
      await sendConnectionRequest(userId);
      setRequestedIds((current) => [...current, userId]);
    } catch (error) {
      window.alert(error?.response?.data?.message || "Could not send connection request.");
    } finally {
      setRequestingId(null);
    }
  };
  return (
    <WorkspacePage eyebrow="DISCOVER" title="Find your next partner" description="Explore people whose skills and ambitions complement your own." action="Update preferences">
      {!canConnect && <Alert type="warning" showIcon message="Complete at least 75% of your profile to send connection requests." description="You can still browse recommendations while your verification is pending." />}
      <div className="partner-filters"><Input value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined />} placeholder="Search by name or role" allowClear /><Select value={role || undefined} onChange={setRole} placeholder="Filter by role" allowClear options={roles.map((item) => ({ value: item, label: item }))} /></div>
      {isLoading ? <div className="partner-loading"><Spin /></div> : <section className="partner-grid" aria-label="Suggested partners">
        {partners.map((partner) => (
          <article className="partner-profile" key={partner._id}>
            <div className="partner-avatar">{partner.photoUrl ? <img src={partner.photoUrl} alt={partner.name} /> : getInitials(partner.name)}</div>
            <div className="partner-profile-main">
              <div className="partner-profile-heading"><div><h2>{partner.name}</h2><p>{partner.role || "Role not set"}</p></div><button className="icon-action" aria-label={`Add ${partner.name}`}><PlusOutlined /></button></div>
              <span className="partner-location"><EnvironmentOutlined /> {partner.professionalField || "Open to new connections"}</span>
              <div className="partner-tags">{[partner.role, partner.professionalField].filter(Boolean).map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
              <Button type="primary" block loading={requestingId === partner._id} disabled={!canConnect || requestedIds.includes(partner._id)} onClick={() => handleRequest(partner._id)}>{requestedIds.includes(partner._id) ? "Request sent" : "Send connection request"}</Button>
            </div>
          </article>
        ))}
        {!partners.length && <div className="partner-empty">No partners match those filters.</div>}
      </section>}
    </WorkspacePage>
  );
}
