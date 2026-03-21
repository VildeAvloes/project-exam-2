import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  function handleCloseMenu() {
    setIsOpen(!isOpen);
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
            onClick={handleCloseMenu}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            aria-controls="mainNavbar"
          >
            <span className="material-symbols-outlined hamburger">
              {isOpen ? "close" : "menu"}
            </span>
          </button>

          <div
            className={`collapse navbar-collapse justify-content-center ${isOpen ? "show" : ""}`}
            id="mainNavbar"
          >
            <div className="navbar-nav mx-lg-auto text-start text-lg-center">
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

      <div className="bg-light py-3">
        <div className="container">
          <form className="d-flex justify-content-center">
            <div className="d-flex w-100 w-lg-50 gap-2">
              <input
                className="form-control"
                type="search"
                placeholder="Search venues"
              />
              <button className="btn btn-primary btn-icon">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
