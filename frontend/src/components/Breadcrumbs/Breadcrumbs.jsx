import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const ROUTE_LABELS = {
  login: "Sign in",
  register: "Create account",
  home: "Home",
  "find-partners": "Find Partners",
  connections: "My Connections",
  messages: "Messages",
  notifications: "Notifications",
  profile: "Profile",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (
    !localStorage.getItem("token") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    segments.length === 0
  ) {
    return null;
  }

  const items = [];
  const startsAtHome = segments[0] === "home";
  const remainingSegments = startsAtHome ? segments.slice(1) : segments;

  items.push({
    title: remainingSegments.length === 0
      ? "Home"
      : <Link to="/home">Home</Link>,
  });

  remainingSegments.forEach((segment, index) => {
      const routeSegments = startsAtHome
        ? ["home", ...remainingSegments.slice(0, index + 1)]
        : remainingSegments.slice(0, index + 1);
      const path = `/${routeSegments.join("/")}`;
      const label = ROUTE_LABELS[segment] || segment.replace(/-/g, " ");
      const isCurrent = index === remainingSegments.length - 1;

      items.push({
        title: isCurrent ? label : <Link to={path}>{label}</Link>,
      });
    });

  return (
    <div className="breadcrumbs" aria-label="Breadcrumb">
      <Breadcrumb separator="/" items={items} />
    </div>
  );
}
