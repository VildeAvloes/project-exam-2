import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import LogoutButton from "./LogoutButton";
import SearchBar from "./SearchBar";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useAuth();

  function handleToggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function handleCloseMenu() {
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container">
          <Link className="navbar-brand logo" to="/" onClick={handleCloseMenu}>
            Holidaze
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            aria-controls="mainNavbar"
          >
            <span className="hamburger">{isOpen ? <FiX /> : <FiMenu />}</span>
          </button>

          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="mainNavbar"
          >
            <div className="navbar-nav ms-lg-auto text-start align-items-lg-center">
              <Link className="nav-link" to="/" onClick={handleCloseMenu}>
                Home
              </Link>

              <Link className="nav-link" to="/venues" onClick={handleCloseMenu}>
                Venues
              </Link>

              <Link
                className="nav-link"
                to="/contact"
                onClick={handleCloseMenu}
              >
                Contact
              </Link>

              {auth ? (
                <>
                  <Link
                    className="nav-link"
                    to="/profile"
                    onClick={handleCloseMenu}
                  >
                    {auth.name || "Profile"}
                  </Link>

                  <div className="text-start">
                    <LogoutButton onLogout={handleCloseMenu} />
                  </div>
                </>
              ) : (
                <Link
                  className="nav-link text-start"
                  to="/login"
                  onClick={handleCloseMenu}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <SearchBar />
    </header>
  );
}
