import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer py-4 mt-5 bg-light ">
      <div className="container text-center">
        <div className="d-flex justify-content-center gap-3 mb-2 small">
          <Link to="/about" className="footer-link">
            About us
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </div>
        <p className="small text-muted mb-2">Find your next stay</p>
        <p className="mb-0 small text-muted">
          © {new Date().getFullYear()} Holidaze
        </p>
      </div>
    </footer>
  );
}
