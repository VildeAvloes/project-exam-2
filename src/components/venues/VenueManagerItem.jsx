export default function VenueManagerItem({ venue, onEdit }) {
  const image = venue.media?.[0]?.url;

  return (
    <article className="card shadow-sm border-0">
      <div className="card-body d-flex gap-3 align-items-center">
        {image && (
          <img
            src={image}
            alt={venue.name}
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
            className="rounded"
          />
        )}

        <div className="flex-grow-1">
          <h3 className="h6 mb-1">{venue.name}</h3>
          <p className="text-muted small mb-0">
            ${venue.price} / night · {venue.maxGuests} guests
          </p>
        </div>

        <button className="btn btn-outline-accent btn-sm" onClick={onEdit}>
          Edit
        </button>
      </div>
    </article>
  );
}
