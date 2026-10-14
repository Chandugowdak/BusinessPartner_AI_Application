import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { acceptConnection, rejectConnection } from "../../DataProvider/AuthDataProvider";
import "./FriendRequests.css";

const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

export default function FriendRequests({ requests, currentUserId, onAccepted, onRejected }) {
  const [workingId, setWorkingId] = useState(null);

  const updateRequest = async (request, action) => {
    try {
      setWorkingId(request._id);
      const response = action === "accept" ? await acceptConnection(request._id) : await rejectConnection(request._id);
      if (action === "accept") onAccepted(response.connection);
      else onRejected(request._id);
    } catch (error) {
      window.alert(error?.response?.data?.message || `Could not ${action} this request.`);
    } finally {
      setWorkingId(null);
    }
  };

  if (!requests.length) return null;

  return <div className="friend-requests"><span className="connections-section-label">Friend requests</span>{requests.map((request) => {
    const isIncoming = String(request.requestedBy) !== String(currentUserId);
    return <div className="connection-request" key={request._id}>
      <div className="chat-avatar">{request.user.photoUrl ? <img src={request.user.photoUrl} alt="" /> : getInitials(request.user.name)}</div>
      <div><strong>{request.user.name}</strong><small>{isIncoming ? "Wants to connect" : "Request sent"}</small></div>
      {isIncoming && <div className="friend-request-actions"><Button size="small" type="primary" icon={<CheckOutlined />} loading={workingId === request._id} onClick={() => updateRequest(request, "accept")} aria-label={`Accept ${request.user.name}`} /><Button size="small" icon={<CloseOutlined />} disabled={workingId === request._id} onClick={() => updateRequest(request, "reject")} aria-label={`Reject ${request.user.name}`} /></div>}
    </div>;
  })}</div>;
}