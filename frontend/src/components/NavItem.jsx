import { Icon, Icons } from "../constants/icons.jsx";

export default function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      className={`nav-item ${active ? "nav-item--active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-item-icon">
        <Icon d={icon} size={18} />
      </span>
      <span className="nav-item-label">{label}</span>
      {badge != null && <span className="nav-item-badge">{badge}</span>}
    </button>
  );
}
