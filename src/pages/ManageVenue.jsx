import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById } from "../api/venues/getVenueById";
import { updateVenue } from "../api/venues/updateVenue";
import { createVenue } from "../api/venues/createVenue";
import { deleteVenue } from "../api/venues/deleteVenue";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import VenueForm from "../components/venues/VenueForm";

export default function ManageVenue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = isEdit
      ? "Holidaze | Manage Venue"
      : "Holidaze | Create Venue";
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;

    async function loadVenue() {
      try {
        const data = await getVenueById(id);
        setVenue(data);
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
      } else {
        const created = await createVenue(data);
        navigate(`/manager/venues/${created.id}`);
      }

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

  if (loading) return <Loader text="Loading venue..." />;

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <h1 className="mb-4">{isEdit ? "Manage venue" : "Create venue"}</h1>

          {status && (
            <Message
              variant={status.type === "error" ? "danger" : status.type}
              title={status.title}
              message={status.message}
              center={false}
            />
          )}

          <VenueForm
            venue={venue}
            onSave={handleSave}
            onDelete={isEdit ? handleDelete : null}
            onCancel={() => navigate("/profile")}
          />
        </div>
      </div>
    </section>
  );
}
