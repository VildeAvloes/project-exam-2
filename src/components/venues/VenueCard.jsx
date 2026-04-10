import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
  return (
    <div className="col">
      <div className="card shadow p-3">
        <h5>{venue.name}</h5>

        <p>{venue.location?.city}</p>

        <p>${venue.price}</p>

        <Link to={`/venue/${venue.id}`} className="btn btn-secondary w-50">
          Book now
        </Link>
      </div>
    </div>
  );
}
