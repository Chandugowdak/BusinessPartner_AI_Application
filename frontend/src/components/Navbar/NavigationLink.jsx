import { NavLink } from "react-router-dom";

export default function NavigationLink({ to, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `workspace-link${isActive ? " active" : ""}`}
    >
      <Icon />
      <span>{label}</span>
      {badge ? <strong>{badge}</strong> : null}
    </NavLink>
  );
}
