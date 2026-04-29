import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById } from "../api/venues/getVenueById";
import { updateVenue } from "../api/venues/updateVenue";
import { createVenue } from "../api/venues/createVenue";
import { deleteVenue } from "../api/venues/deleteVenue";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import VenueForm from "../components/venues/manager/VenueForm";
import VenueBookingsList from "../components/venues/manager/VenueBookingList";
import VenuePreview from "../components/venues/manager/VenuePreview";
import { useAuth } from "../contexts/AuthContext";

const emptyMediaItem = {
  url: "",
  alt: "",
};

const initialVenueValues = {
  name: "",
  description: "",
  price: 1,
  maxGuests: 1,
  rating: 0,
  media: [emptyMediaItem],
  address: "",
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

function getMediaValues(media = []) {
  if (!media.length) {
    return [emptyMediaItem];
  }

  return media.map((image) => ({
    url: image.url || "",
    alt: image.alt || "",
  }));
}

function mapVenueToFormValues(venue) {
  if (!venue) return initialVenueValues;

  return {
    name: venue.name || "",
    description: venue.description || "",
    price: venue.price || 1,
    maxGuests: venue.maxGuests || 1,
    rating: venue.rating ?? 0,
    media: getMediaValues(venue.media),
    address: venue.location?.address || "",
    city: venue.location?.city || "",
    country: venue.location?.country || "",
    wifi: venue.meta?.wifi || false,
    parking: venue.meta?.parking || false,
    breakfast: venue.meta?.breakfast || false,
    pets: venue.meta?.pets || false,
  };
}

function buildVenuePayload(formValues) {
  return {
    name: formValues.name.trim(),
    description: formValues.description.trim(),
    price: Number(formValues.price),
    maxGuests: Number(formValues.maxGuests),
    rating: Number(formValues.rating),
    media: formValues.media
      .filter((image) => image.url.trim())
      .map((image) => ({
        url: image.url.trim(),
        alt: image.alt.trim() || formValues.name.trim(),
      })),
    meta: {
      wifi: formValues.wifi,
      parking: formValues.parking,
      breakfast: formValues.breakfast,
      pets: formValues.pets,
    },
    location: {
      address: formValues.address.trim(),
      city: formValues.city.trim(),
      country: formValues.country.trim(),
    },
  };
}

export default function ManageVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const isEdit = Boolean(id);

  const [venue, setVenue] = useState(null);
  const [draftValues, setDraftValues] = useState(initialVenueValues);
  const [loading, setLoading] = useState(isEdit);
  const [status, setStatus] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    document.title = isEdit
      ? "Holidaze | Manage Venue"
      : "Holidaze | Create Venue";
  }, [isEdit]);

  useEffect(() => {
    async function loadVenue() {
      if (!isEdit) {
        setDraftValues(initialVenueValues);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getVenueById(id, "?_bookings=true");
        setVenue(data);
        setDraftValues(mapVenueToFormValues(data));
        setStatus(null);
      } catch (error) {
        setStatus({
          type: "error",
          title: "Failed to load venue",
          message: error.message || "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id, isEdit]);

  async function handleSave(data) {
    try {
      if (isEdit) {
        await updateVenue(id, data);

        const updatedVenue = await getVenueById(id, "?_bookings=true");
        setVenue(updatedVenue);
        setDraftValues(mapVenueToFormValues(updatedVenue));
      } else {
        const createdVenue = await createVenue(data);
        navigate(`/manager/venues/${createdVenue.id}`);
      }

      setIsPreview(false);

      setStatus({
        type: "success",
        message: isEdit
          ? "Venue updated successfully."
          : "Venue created successfully.",
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to save venue.",
      };
    }
  }

  async function handleDelete() {
    try {
      await deleteVenue(id);
      navigate("/profile");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to delete venue.",
      };
    }
  }

  function handlePreview() {
    setIsPreview(true);
  }

  function handleCancel() {
    navigate("/profile");
  }

  function handleBackFromPreview() {
    setIsPreview(false);
  }

  if (loading) {
    return <Loader text="Loading venue..." />;
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <button
            type="button"
            className="btn btn-outline-primary mb-4"
            onClick={() => navigate("/profile")}
          >
            Back to profile
          </button>
          <div className="mb-4">
            <h1 className="h3 mb-1">
              {isEdit ? "Manage venue" : "Create venue"}
            </h1>
            <p className="text-muted mb-0">
              {isEdit
                ? "Update your venue details, preview changes, and review bookings."
                : "Create a new venue and preview it before publishing."}
            </p>
          </div>

          {status && (
            <div className="mb-4">
              <Message
                variant={status.type === "error" ? "danger" : status.type}
                title={status.title}
                message={status.message}
                center={false}
              />
            </div>
          )}

          {isPreview ? (
            <VenuePreview
              venue={{ ...buildVenuePayload(draftValues), owner: auth }}
              onBack={handleBackFromPreview}
              onSave={handleSave}
            />
          ) : (
            <VenueForm
              venue={venue}
              values={draftValues}
              setValues={setDraftValues}
              onSave={handleSave}
              onDelete={isEdit ? handleDelete : null}
              onCancel={handleCancel}
              onPreview={handlePreview}
            />
          )}

          {isEdit && !isPreview && (
            <div className="mt-5">
              <VenueBookingsList
                bookings={venue?.bookings || []}
                price={venue?.price || 0}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
