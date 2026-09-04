import { ArrowRightOutlined } from "@ant-design/icons";
import "./WorkspacePage.css";

export default function WorkspacePage({ eyebrow, title, description, action, onAction, children }) {
  return (
    <main className="workspace-page">
      <div className="workspace-page-header">
        <div>
          <span className="workspace-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action ? (
          <button className="workspace-header-action" onClick={onAction}>
            {action}
            <ArrowRightOutlined />
          </button>
        ) : null}
      </div>
      {children}
    </main>
  );
}
