import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container py-5 text-center">
      <h1 className="mb-3">404 - Not Found</h1>
      <p className="text-muted mb-4">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </section>
  );
}
