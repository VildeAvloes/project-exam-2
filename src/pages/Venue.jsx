import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../api/venues/getVenueById";

export default function Venue() {
  const { id } = useParams();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenue() {
      const data = await getVenueById(id);
      console.log("loaded data:", data);
      setVenue(data);
      setLoading(false);
    }

    loadVenue();
  }, [id]);

  console.log("venue.state", venue);

  if (loading) {
    return (
      <div className="container py-4">
        <p>Loading venue...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container py-4">
        <p>Venue not found.</p>
      </div>
    );
  }

  const image =
    venue.media && venue.media.length > 0
      ? venue.media[0].url
      : "https://placehold.co/800x500?text=No+image";

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <img src={image} alt={venue.name} className="img-fluid rounded" />
        </div>

        <div className="col-12 col-lg-6">
          <h1 className="mb-3">{venue.name}</h1>

          {venue.location?.city && (
            <p className="text-muted">
              {venue.location.city}, {venue.location.country}
            </p>
          )}

          <h4 className="mb-3">${venue.price} / night</h4>

          <p>{venue.description}</p>

          <button className="btn btn-primary mt-3">Book now</button>
        </div>
      </div>
    </div>
  );
}
