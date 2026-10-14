import { useNavigate } from "react-router-dom";
import logo from "../../assets/bizmatch-logo.png";

export default function BrandLogo() {
  const navigate = useNavigate();

  return (
    <button className="workspace-brand" onClick={() => navigate("/home")} aria-label="BizMatch home">
      <img src={logo} alt="" />
      <span>Biz<span>Match</span></span>
    </button>
  );
}
