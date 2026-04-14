import Message from "../common/Message";
import VenueForm from "./VenueForm";
import VenueManagerItem from "./VenueManagerItem";

export default function VenueManagerList({
  venues = [],
  editingVenueId,
  updatingVenueId,
  deletingVenueId,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) {
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
      {venues.map((venue) => {
        const id = venue.id;

        const isEditing = editingVenueId === id;
        const isUpdating = updatingVenueId === id;
        const isDeleting = deletingVenueId === id;

        return isEditing ? (
          <VenueForm
            key={id}
            venue={venue}
            isSubmitting={isUpdating}
            isDeleting={isDeleting}
            onCancel={onCancelEdit}
            onSave={onSave}
            onDelete={onDelete}
          />
        ) : (
          <VenueManagerItem key={id} venue={venue} onEdit={() => onEdit(id)} />
        );
      })}
    </div>
  );
}
