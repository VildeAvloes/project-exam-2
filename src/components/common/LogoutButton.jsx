import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../utils/storage/clearAuth";
import { useAuth } from "../../contexts/AuthContext";

export default function LogoutButton({ onLogout }) {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  function handleLogout() {
    clearAuth();
    setAuth(null);

    if (onLogout) {
      onLogout();
    }

    navigate("/");
  }

  return (
    <button
      type="button"
      className="nav-link nav-link-button"
      onClick={handleLogout}
    >
      Log out
    </button>
  );
}
