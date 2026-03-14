import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container">
          <Link className="navbar-brand logo" to="/">
            Holidaze
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-center"
            id="mainNavbar"
          >
            <div className="navbar-nav">
              <Link className="nav-link" to="/">
                Home
              </Link>
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white pb-3">
        <div className="container">
          <form className="d-flex justify-content-center">
            <div className="d-flex w-100 w-lg-50 gap-2">
              <input
                className="form-control"
                type="search"
                placeholder="Search venues"
              />
              <button className="btn btn-primary">Search</button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
