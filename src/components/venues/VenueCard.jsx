import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
  return (
    <div className="col">
      <div className="card shadow p-3">
        <p>{venue.name}</p>

        <p>{venue.location?.city}</p>

        <p>${venue.price}</p>

        <Link to={`/venue/${venue.id}`} className="btn btn-accent w-50">
          View venue
        </Link>
      </div>
    </div>
  );
}
