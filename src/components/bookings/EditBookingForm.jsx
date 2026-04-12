import { useState } from "react";
import Message from "../common/Message";

function toDateInputValue(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

function getTodayAsDateInput() {
  return new Date().toISOString().split("T")[0];
}

export default function EditBookingForm({
  booking,
  isSubmitting = false,
  isDeleting = false,
  onCancel,
  onSave,
  onDelete,
}) {
  const bookingId = booking.id || booking._id;
  const maxGuests = booking?.venue?.maxGuests || 1;
  const today = getTodayAsDateInput();

  const initialValues = {
    dateFrom: toDateInputValue(booking?.dateFrom),
    dateTo: toDateInputValue(booking?.dateTo),
    guests: booking?.guests || 1,
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function validate(formValues) {
    const newErrors = {};
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const fromDate = formValues.dateFrom ? new Date(formValues.dateFrom) : null;
    const toDate = formValues.dateTo ? new Date(formValues.dateTo) : null;

    if (!formValues.dateFrom) {
      newErrors.dateFrom = "Please select a check-in date";
    } else if (fromDate < todayDate) {
      newErrors.dateFrom = "Check-in date cannot be in the past";
    }

    if (!formValues.dateTo) {
      newErrors.dateTo = "Please select a check-out date";
    } else if (fromDate && toDate <= fromDate) {
      newErrors.dateTo = "Check-out date must be after check-in date";
    }

    if (!formValues.guests || Number(formValues.guests) < 1) {
      newErrors.guests = "Guests must be at least 1";
    } else if (Number(formValues.guests) > maxGuests) {
      newErrors.guests = `Guests cannot exceed ${maxGuests}`;
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setStatus(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setShowDeleteConfirm(false);

    const result = await onSave(bookingId, {
      dateFrom: new Date(values.dateFrom).toISOString(),
      dateTo: new Date(values.dateTo).toISOString(),
      guests: Number(values.guests),
    });

    if (!result?.success) {
      setStatus({
        type: "error",
        title: "Could not update booking",
        message: result?.message || "Failed to update booking.",
      });
    }
  }

  async function handleConfirmDelete() {
    setStatus(null);

    const result = await onDelete(bookingId);

    if (!result?.success) {
      setStatus({
        type: "error",
        title: "Could not delete booking",
        message: result?.message || "Failed to delete booking.",
      });
      return;
    }

    setShowDeleteConfirm(false);
  }

  return (
    <article className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <p className="text-uppercase text-muted fw-semibold small mb-1">
              Editing booking
            </p>
            <h3 className="h5 mb-0">{booking?.venue?.name || "Venue"}</h3>
          </div>
        </div>

        {status && (
          <div className="mb-3">
            <Message
              variant={status.type === "error" ? "danger" : status.type}
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
              <h4 className="h6 mb-2">Delete this booking?</h4>
              <p className="mb-0">This action cannot be undone.</p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={isSubmitting || isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, delete booking"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting || isDeleting}
              >
                Keep booking
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label htmlFor={`dateFrom-${bookingId}`} className="form-label">
                Check-in
              </label>
              <input
                id={`dateFrom-${bookingId}`}
                name="dateFrom"
                type="date"
                className={`form-control ${
                  errors.dateFrom ? "is-invalid" : ""
                }`}
                value={values.dateFrom}
                onChange={handleChange}
                min={today}
                required
              />
              {errors.dateFrom && (
                <div className="invalid-feedback">{errors.dateFrom}</div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor={`dateTo-${bookingId}`} className="form-label">
                Check-out
              </label>
              <input
                id={`dateTo-${bookingId}`}
                name="dateTo"
                type="date"
                className={`form-control ${errors.dateTo ? "is-invalid" : ""}`}
                value={values.dateTo}
                onChange={handleChange}
                min={values.dateFrom || today}
                required
              />
              {errors.dateTo && (
                <div className="invalid-feedback">{errors.dateTo}</div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor={`guests-${bookingId}`} className="form-label">
                Guests
              </label>
              <input
                id={`guests-${bookingId}`}
                name="guests"
                type="number"
                min="1"
                max={maxGuests}
                className={`form-control ${errors.guests ? "is-invalid" : ""}`}
                value={values.guests}
                onChange={handleChange}
                required
              />
              {errors.guests ? (
                <div className="invalid-feedback">{errors.guests}</div>
              ) : (
                <div className="form-text">Max guests: {maxGuests}</div>
              )}
            </div>
          </div>

          {!showDeleteConfirm && (
            <div className="d-flex justify-content-end mb-4">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting || isDeleting}
              >
                Delete booking
              </button>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-center justify-content-lg-end">
            <button
              type="button"
              className="btn btn-outline-accent"
              onClick={onCancel}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-accent"
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
