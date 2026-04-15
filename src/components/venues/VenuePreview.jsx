import { FaWifi, FaParking, FaCoffee, FaPaw } from "react-icons/fa";

export default function VenuePreview({ venue, onBack, onSave }) {
  const image = venue.media?.[0]?.url || "";
  const imageAlt = venue.media?.[0]?.alt || venue.name;

  const location = [venue.location?.city, venue.location?.country]
    .filter(Boolean)
    .join(", ");

  const amenities = [
    { label: "WiFi", value: venue.meta?.wifi, icon: FaWifi },
    { label: "Parking", value: venue.meta?.parking, icon: FaParking },
    { label: "Breakfast", value: venue.meta?.breakfast, icon: FaCoffee },
    { label: "Pets allowed", value: venue.meta?.pets, icon: FaPaw },
  ].filter((item) => item.value);

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h5 mb-3">Preview</h2>
          <p className="text-muted mb-0">This is how your venue will look.</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        {image ? (
          <img src={image} alt={imageAlt} className="img-fluid" />
        ) : (
          <div className="venue-image-fallback" />
        )}

        <div className="card-body p-4">
          <h1 className="mb-2">{venue.name}</h1>
          <p className="text-muted mb-3">{location}</p>

          <p className="mb-4">{venue.description}</p>

          <p className="fw-semibold mb-3">${venue.price} / night</p>

          {amenities.length > 0 && (
            <ul className="list-unstyled d-flex flex-wrap gap-2">
              {amenities.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label} className="venue-amenity">
                    <Icon />
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between flex-wrap gap-2">
        <button className="btn btn-outline-secondary" onClick={onBack}>
          Back to editing
        </button>

        <button className="btn btn-accent" onClick={() => onSave(venue)}>
          Save venue
        </button>
      </div>
    </div>
  );
}
