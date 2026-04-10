import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/storage/clearAuth";
import { useAuth } from "../contexts/AuthContext";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  function handleLogout() {
    clearAuth();
    setAuth(null);
    navigate("/");
  }

  return (
    <button type="button" className="nav-link" onClick={handleLogout}>
      Log out
    </button>
  );
}
