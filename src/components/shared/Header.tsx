import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import "./Header.css";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>Products</h1>
      </div>
      <MobileMenu />
      <div className="header-user-info">
        <span>{user?.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
