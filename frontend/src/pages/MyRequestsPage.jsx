import { CheckOutlined, CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { acceptConnection, getConnections, rejectConnection } from "../DataProvider/AuthDataProvider";
import WorkspacePage from "./WorkspacePage";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function MyRequestsPage() {
  const profile = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    getConnections().then((response) => {
      setRequests((response.requests || []).filter((request) => String(request.requestedBy) !== String(profile._id)));
    }).catch(() => setRequests([])).finally(() => setIsLoading(false));
  }, [profile._id]);

  const updateRequest = async (request, action) => {
    try {
      setWorkingId(request._id);
      if (action === "accept") await acceptConnection(request._id);
      else await rejectConnection(request._id);
      setRequests((current) => current.filter((item) => item._id !== request._id));
    } catch (error) {
      window.alert(error?.response?.data?.message || `Could not ${action} this request.`);
    } finally {
      setWorkingId(null);
    }
  };

  return <WorkspacePage eyebrow="YOUR NETWORK" title="My requests" description="Review invitations from people who want to build something with you.">
    {isLoading ? <div className="partner-loading"><Spin /></div> : <section className="requests-list" aria-label="Connection requests">
      {!requests.length && <Alert type="info" showIcon icon={<UserAddOutlined />} message="No pending invitations" description="When someone invites you, their profile details will appear here." />}
      {requests.map((request) => {
        const person = request.user || {};
        return <article className="request-card" key={request._id}>
          <div className="request-avatar">{person.photoUrl ? <img src={person.photoUrl} alt={person.name} /> : getInitials(person.name)}</div>
          <div className="request-card-content">
            <div className="request-card-heading"><div><h2>{person.name}</h2><p>{person.role || "Business professional"}</p></div><span className="request-completion">{person.profileCompletion || 0}% profile</span></div>
            <div className="request-details"><span>{person.professionalField || "Open to opportunities"}</span><span>{person.email}</span>{person.phone && <span>{person.phone}</span>}</div>
            <div className="request-actions"><Button type="primary" icon={<CheckOutlined />} loading={workingId === request._id} onClick={() => updateRequest(request, "accept")}>Accept invitation</Button><Button icon={<CloseOutlined />} disabled={workingId === request._id} onClick={() => updateRequest(request, "reject")}>Decline</Button></div>
          </div>
        </article>;
      })}
    </section>}
  </WorkspacePage>;
}
