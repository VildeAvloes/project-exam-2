import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function handleCloseMenu() {
    setIsOpen(false);
  }

  return (
    <header>
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
            <span className="material-symbols-outlined hamburger">
              {isOpen ? "close" : "menu"}
            </span>
          </button>

          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="mainNavbar"
          >
            <div className="navbar-nav ms-lg-auto text-start">
              <Link className="nav-link" to="/" onClick={handleCloseMenu}>
                Home
              </Link>
              <Link
                className="nav-link"
                to="/contact"
                onClick={handleCloseMenu}
              >
                Contact
              </Link>
              <Link className="nav-link" to="/login" onClick={handleCloseMenu}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <SearchBar />
    </header>
  );
}
