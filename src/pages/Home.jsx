import { useEffect, useState } from "react";
import { getVenues } from "../api/venues/getVenues";
import VenueCard from "../components/venues/VenueCard";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Holidaze | Home";
  }, []);

  useEffect(() => {
    async function loadVenues() {
      const data = await getVenues();
      setVenues(data);
      setLoading(false);
    }

    loadVenues();
  }, []);

  if (loading) {
    return <p className="container py-4">Loading venues...</p>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Venues</h1>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
