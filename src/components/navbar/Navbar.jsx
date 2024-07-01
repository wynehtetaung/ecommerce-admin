import "./navbar.css";
import navLogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="nav-bar">
      <img onClick={() => navigate("/")} src={navLogo} className="nav-logo" />
      <img src={navProfile} className="nav-profile" />
    </div>
  );
}
