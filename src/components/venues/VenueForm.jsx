import { useEffect, useState } from "react";
import Message from "../common/Message";
import { useNavigate } from "react-router-dom";

export default function VenueForm({ venue, onSave, onDelete, onCancel }) {
  const navigate = useNavigate();
  const isEdit = Boolean(venue);

  const initialValues = {
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

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!venue) return;

    setValues({
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
    });
  }, [venue]);

  function validate(formValues) {
    const newErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Venue name is required";
    }

    if (!formValues.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formValues.price || Number(formValues.price) < 1) {
      newErrors.price = "Price must be at least 1";
    }

    if (!formValues.maxGuests || Number(formValues.maxGuests) < 1) {
      newErrors.maxGuests = "Max guests must be at least 1";
    }

    if (!formValues.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formValues.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (formValues.imageUrl.trim()) {
      try {
        new URL(formValues.imageUrl);
      } catch {
        newErrors.imageUrl = "Please enter a valid image URL";
      }
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "maxGuests"
            ? Number(value)
            : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setStatus(null);
  }

  function buildPayload(formValues) {
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

  function handlePreview() {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    navigate("/manager/venues/preview", {
      state: {
        previewVenue: {
          ...buildPayload(values),
          rating: venue?.rating ?? 0,
          id: venue?.id ?? "preview",
        },
      },
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    setShowDeleteConfirm(false);

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    const result = await onSave(buildPayload(values));

    if (!result?.success) {
      setStatus({
        type: "error",
        title: "Something went wrong",
        message: result?.message || "Failed to save venue.",
      });
    }

    setLoading(false);
  }

  async function handleConfirmDelete() {
    setStatus(null);

    const result = await onDelete();

    if (!result?.success) {
      setStatus({
        type: "error",
        title: "Could not delete venue",
        message: result?.message || "Failed to delete venue.",
      });
      return;
    }

    setShowDeleteConfirm(false);
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h2 className="h5 mb-4">{isEdit ? "Edit venue" : "Create venue"}</h2>

        {status && (
          <div className="mb-3">
            <Message
              variant="danger"
              title={status.title}
              message={status.message}
              center={false}
            />
          </div>
        )}

        {showDeleteConfirm && (
          <div
            className="alert alert-warning d-flex flex-column gap-3 mb-4"
            role="alert"
          >
            <div>
              <h3 className="h6 mb-2">Delete this venue?</h3>
              <p className="mb-0">This action cannot be undone.</p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                Delete venue
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Keep venue
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <h3 className="h6 mb-3">Basic details</h3>

            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Venue name
              </label>
              <input
                id="name"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={values.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                value={values.description}
                onChange={handleChange}
                required
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="price">
                  Price per night
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  value={values.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="maxGuests">
                  Max guests
                </label>
                <input
                  id="maxGuests"
                  name="maxGuests"
                  type="number"
                  min="1"
                  className={`form-control ${
                    errors.maxGuests ? "is-invalid" : ""
                  }`}
                  value={values.maxGuests}
                  onChange={handleChange}
                  required
                />
                {errors.maxGuests && (
                  <div className="invalid-feedback">{errors.maxGuests}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h6 mb-3">Image</h3>

            <div className="mb-3">
              <label className="form-label" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className={`form-control ${
                  errors.imageUrl ? "is-invalid" : ""
                }`}
                value={values.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <div className="invalid-feedback">{errors.imageUrl}</div>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="imageAlt">
                Image alt text
              </label>
              <input
                id="imageAlt"
                name="imageAlt"
                className="form-control"
                value={values.imageAlt}
                onChange={handleChange}
                placeholder="Exterior view of the venue"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h6 mb-3">Location</h3>

            <div className="mb-3">
              <label className="form-label" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                name="address"
                className="form-control"
                value={values.address}
                onChange={handleChange}
              />
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  value={values.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="zip">
                  Zip code
                </label>
                <input
                  id="zip"
                  name="zip"
                  className="form-control"
                  value={values.zip}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  className={`form-control ${
                    errors.country ? "is-invalid" : ""
                  }`}
                  value={values.country}
                  onChange={handleChange}
                  required
                />
                {errors.country && (
                  <div className="invalid-feedback">{errors.country}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="continent">
                  Continent
                </label>
                <input
                  id="continent"
                  name="continent"
                  className="form-control"
                  value={values.continent}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h6 mb-3">Amenities</h3>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <div className="form-check">
                  <input
                    id="wifi"
                    name="wifi"
                    type="checkbox"
                    className="form-check-input"
                    checked={values.wifi}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="wifi">
                    WiFi
                  </label>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="form-check">
                  <input
                    id="parking"
                    name="parking"
                    type="checkbox"
                    className="form-check-input"
                    checked={values.parking}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="parking">
                    Parking
                  </label>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="form-check">
                  <input
                    id="breakfast"
                    name="breakfast"
                    type="checkbox"
                    className="form-check-input"
                    checked={values.breakfast}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="breakfast">
                    Breakfast
                  </label>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="form-check">
                  <input
                    id="pets"
                    name="pets"
                    type="checkbox"
                    className="form-check-input"
                    checked={values.pets}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="pets">
                    Pets allowed
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
            <div className="d-flex gap-2 flex-wrap">
              {isEdit && onDelete && !showDeleteConfirm && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                >
                  Delete venue
                </button>
              )}

              {onCancel && (
                <button
                  type="button"
                  className="btn btn-outline-accent"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handlePreview}
                disabled={loading}
              >
                Preview
              </button>

              <button
                type="submit"
                className="btn btn-accent"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Save changes"
                    : "Create venue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
