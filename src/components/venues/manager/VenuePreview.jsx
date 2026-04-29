import { FaWifi, FaParking, FaCoffee, FaPaw, FaStar } from "react-icons/fa";
import { FiMapPin, FiUsers } from "react-icons/fi";
import VenueGallery from "../VenueGallery";

export default function VenuePreview({ venue, onBack, onSave }) {
  const location = [venue.location?.city, venue.location?.country]
    .filter(Boolean)
    .join(", ");

  const owner = venue.owner;
  const ownerAvatar = owner?.avatar?.url || owner?.avatar || "";

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
          <VenueGallery media={venue.media || []} fallbackAlt={venue.name} />
        </div>

        <div className="col-12 col-lg-5">
          <div className="pt-3">
            <h1 className="h3 mb-2">{venue.name}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <p className="mb-0 d-inline-flex align-items-center gap-2">
                <FiMapPin />
                <span>{location}</span>
              </p>

              <span className="venue-rating-badge">
                <FaStar aria-hidden="true" />
                <span>{venue.rating ?? 0}</span>
              </span>
            </div>

            {owner && (
              <div className="venue-host d-flex align-items-center gap-3 mb-4 py-3">
                {ownerAvatar ? (
                  <img
                    src={ownerAvatar}
                    alt={`${owner.name} avatar`}
                    className="venue-host-avatar"
                  />
                ) : (
                  <div className="venue-host-avatar venue-host-avatar--fallback d-flex align-items-center justify-content-center">
                    <span>{owner.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}

                <div>
                  <p className="small text-muted mb-1">Hosted by</p>
                  <p className="fw-semibold mb-0">{owner.name}</p>
                </div>
              </div>
            )}

            <p className="mb-4">{venue.description}</p>

            <div className="d-flex align-items-end gap-2 mb-4 ">
              <span className="h3 mb-0 text-secondary">${venue.price}</span>
              <span className="text-muted mb-1">/ night</span>
            </div>

            <div className="mb-4">
              <p className="small text-muted mb-1">Max guests</p>
              <p className="mb-0 fw-semibold d-inline-flex align-items-center gap-2">
                <FiUsers />
                <span>{venue.maxGuests}</span>
              </p>
            </div>

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
