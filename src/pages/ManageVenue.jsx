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

const initialVenueValues = {
  name: "",
  description: "",
  price: 1,
  maxGuests: 1,
  imageUrl: "",
  imageAlt: "",
  address: "",
  city: "",
  zip: "",
  country: "",
  continent: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

function mapVenueToFormValues(venue) {
  if (!venue) return initialVenueValues;

  return {
    name: venue.name || "",
    description: venue.description || "",
    price: venue.price || 1,
    maxGuests: venue.maxGuests || 1,
    imageUrl: venue.media?.[0]?.url || "",
    imageAlt: venue.media?.[0]?.alt || "",
    address: venue.location?.address || "",
    city: venue.location?.city || "",
    zip: venue.location?.zip || "",
    country: venue.location?.country || "",
    continent: venue.location?.continent || "",
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
    media: formValues.imageUrl.trim()
      ? [
          {
            url: formValues.imageUrl.trim(),
            alt: formValues.imageAlt.trim() || formValues.name.trim(),
          },
        ]
      : [],
    meta: {
      wifi: formValues.wifi,
      parking: formValues.parking,
      breakfast: formValues.breakfast,
      pets: formValues.pets,
    },
    location: {
      address: formValues.address.trim(),
      city: formValues.city.trim(),
      zip: formValues.zip.trim(),
      country: formValues.country.trim(),
      continent: formValues.continent.trim(),
    },
  };
}

export default function ManageVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (!isEdit) {
      setDraftValues(initialVenueValues);
      setLoading(false);
      return;
    }

    async function loadVenue() {
      try {
        const data = await getVenueById(id, "?_bookings=true");
        setVenue(data);
        setDraftValues(mapVenueToFormValues(data));
        setStatus(null);
      } catch (error) {
        setStatus({
          type: "error",
          title: "Failed to load venue",
          message: error.message,
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
        const updated = await getVenueById(id, "?_bookings=true");
        setVenue(updated);
        setDraftValues(mapVenueToFormValues(updated));
      } else {
        const created = await createVenue(data);
        navigate(`/manager/venues/${created.id}`);
      }

      setIsPreview(false);

      setStatus({
        type: "success",
        message: isEdit
          ? "Venue updated successfully"
          : "Venue created successfully",
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function handleDelete() {
    try {
      await deleteVenue(id);
      navigate("/profile");
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  function handlePreview() {
    setIsPreview(true);
  }

  if (loading) {
    return <Loader text="Loading venue..." />;
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
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

          {!isPreview ? (
            <VenueForm
              venue={venue}
              values={draftValues}
              setValues={setDraftValues}
              onSave={handleSave}
              onDelete={isEdit ? handleDelete : null}
              onCancel={() => navigate("/profile")}
              onPreview={handlePreview}
            />
          ) : (
            <VenuePreview
              venue={buildVenuePayload(draftValues)}
              onBack={() => setIsPreview(false)}
              onSave={handleSave}
            />
          )}

          {isEdit && !isPreview && (
            <div className="mt-5">
              <VenueBookingsList bookings={venue?.bookings || []} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
