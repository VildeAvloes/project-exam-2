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
    <section>
      <div className="mb-4">
        <p className="text-uppercase text-muted fw-semibold small mb-2">
          Preview
        </p>
        <h2 className="h4 mb-1">Venue preview</h2>
        <p className="text-muted mb-0">This is how your venue will look.</p>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-7">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className="img-fluid rounded-4 w-100 venue-hero-image"
            />
          ) : (
            <div className="venue-hero-image-placeholder rounded-4" />
          )}
        </div>

        <div className="col-12 col-lg-5">
          <div>
            <h1 className="h3 mb-2">{venue.name}</h1>
            <p className="text-muted mb-3">{location}</p>

            <p className="mb-4">{venue.description}</p>

            <p className="fw-semibold mb-4">
              ${venue.price}{" "}
              <span className="text-muted fw-normal">/ night</span>
            </p>

            {amenities.length > 0 && (
              <ul className="venue-amenities list-unstyled d-flex flex-wrap gap-2 mb-0">
                {amenities.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.label} className="venue-amenity">
                      <Icon className="venue-amenity__icon" />
                      <span>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between flex-wrap gap-2 mt-4">
        <button className="btn btn-outline-secondary" onClick={onBack}>
          Back to editing
        </button>

        <button className="btn btn-accent" onClick={() => onSave(venue)}>
          Save venue
        </button>
      </div>
    </section>
  );
}
