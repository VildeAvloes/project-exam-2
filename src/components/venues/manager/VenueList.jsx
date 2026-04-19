import Message from "../../common/Message";
import VenueItem from "./VenueItem";

export default function VenueManagerList({ venues = [], onManage }) {
  if (!venues.length) {
    return (
      <Message
        variant="info"
        title="No venues yet"
        message="You haven’t created any venues yet."
        center={false}
      />
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {venues.map((venue) => (
        <VenueItem
          key={venue.id}
          venue={venue}
          onManage={() => onManage(venue.id)}
        />
      ))}
    </div>
  );
}
