import { useState } from "react";
import Message from "../../common/Message";

export default function VenueForm({
  venue,
  values,
  setValues,
  onSave,
  onDelete,
  onCancel,
  onPreview,
}) {
  const isEdit = Boolean(venue);

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    formValues.media.forEach((image, index) => {
      if (image.url.trim()) {
        try {
          new URL(image.url);
        } catch {
          newErrors.media = `Image ${index + 1} must have a valid URL`;
        }
      }
    });

    return newErrors;
  }

  function buildPayload(formValues) {
    return {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      price: Number(formValues.price),
      maxGuests: Number(formValues.maxGuests),
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
        zip: formValues.zip.trim(),
        country: formValues.country.trim(),
        continent: formValues.continent.trim(),
      },
    };
  }

  function handleMediaChange(index, field, value) {
    setValues((prev) => ({
      ...prev,
      media: prev.media.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [field]: value } : image
      ),
    }));

    setErrors((prev) => ({
      ...prev,
      media: undefined,
    }));

    setStatus(null);
  }

  function handleAddImage() {
    setValues((prev) => ({
      ...prev,
      media: [...prev.media, { url: "", alt: "" }],
    }));
  }

  function handleRemoveImage(index) {
    setValues((prev) => ({
      ...prev,
      media:
        prev.media.length > 1
          ? prev.media.filter((_, imageIndex) => imageIndex !== index)
          : [{ url: "", alt: "" }],
    }));
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

  function handlePreview() {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!onPreview) return;

    onPreview();
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
    if (!onDelete) return;

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
    <section className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="mb-4">
          <p className="text-uppercase text-muted fw-semibold small mb-2">
            {isEdit ? "Edit" : "Create"}
          </p>
          <h2 className="h4 mb-0">{isEdit ? `${values.name}` : "New venue"}</h2>
        </div>

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
            <h3 className="h6 mb-3">Details</h3>

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
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
              <h3 className="h6 mb-0">Images</h3>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddImage}
                disabled={loading}
              >
                Add image
              </button>
            </div>

            {errors.media && (
              <div className="text-danger small mb-3">{errors.media}</div>
            )}

            <div className="d-flex flex-column gap-3">
              {values.media.map((image, index) => (
                <div key={index} className="venue-media-field p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="fw-semibold mb-0">
                      {index === 0 ? "Main image" : `Image ${index + 1}`}
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveImage(index)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-3">
                    <label
                      className="form-label"
                      htmlFor={`media-url-${index}`}
                    >
                      Image URL
                    </label>
                    <input
                      id={`media-url-${index}`}
                      type="url"
                      className="form-control"
                      value={image.url}
                      onChange={(event) =>
                        handleMediaChange(index, "url", event.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label
                      className="form-label"
                      htmlFor={`media-alt-${index}`}
                    >
                      Image alt text
                    </label>
                    <input
                      id={`media-alt-${index}`}
                      className="form-control"
                      value={image.alt}
                      onChange={(event) =>
                        handleMediaChange(index, "alt", event.target.value)
                      }
                      placeholder="Exterior view of the venue"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="form-text mt-2 mb-0">
              The first image will be used as the main image.
            </p>
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
    </section>
  );
}
