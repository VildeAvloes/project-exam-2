import { useState } from "react";
import { DayPicker } from "react-day-picker";
import Message from "../common/Message";

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

function toApiDate(date) {
  const safeDate = new Date(date);
  safeDate.setHours(12, 0, 0, 0);
  return safeDate.toISOString();
}

function getNights(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) return 0;

  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const diffMs = end - start;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.max(diffDays, 0);
}

function getDisabledBookingRanges(bookings = [], currentBookingId) {
  return bookings
    .filter((booking) => {
      const bookingId = booking.id || booking._id;

      return (
        booking.dateFrom && booking.dateTo && bookingId !== currentBookingId
      );
    })
    .map((booking) => ({
      from: new Date(booking.dateFrom),
      to: new Date(booking.dateTo),
    }));
}

export default function EditBookingForm({
  booking,
  bookings = [],
  isSubmitting = false,
  isDeleting = false,
  onCancel,
  onSave,
  onDelete,
}) {
  const bookingId = booking.id || booking._id;
  const maxGuests = booking?.venue?.maxGuests || 1;
  const price = Number(booking?.venue?.price || 0);
  const today = getToday();

  const disabledDates = [
    { before: today },
    ...getDisabledBookingRanges(bookings, bookingId),
  ];

  const initialRange = {
    from: booking?.dateFrom ? new Date(booking.dateFrom) : undefined,
    to: booking?.dateTo ? new Date(booking.dateTo) : undefined,
  };

  const initialValues = {
    guests: booking?.guests || 1,
  };

  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [showCalendar, setShowCalendar] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function validate() {
    const newErrors = {};

    if (!selectedRange?.from) {
      newErrors.dateFrom = "Please select a check-in date";
    }

    if (!selectedRange?.to) {
      newErrors.dateTo = "Please select a check-out date";
    }

    if (
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.to <= selectedRange.from
    ) {
      newErrors.dateTo = "Check-out date must be after check-in date";
    }

    if (!values.guests || Number(values.guests) < 1) {
      newErrors.guests = "Guests must be at least 1";
    } else if (Number(values.guests) > maxGuests) {
      newErrors.guests = `Guests cannot exceed ${maxGuests}`;
    }

    return newErrors;
  }

  function handleGuestsChange(event) {
    const { value } = event.target;

    setValues((prev) => ({
      ...prev,
      guests: Number(value),
    }));

    setErrors((prev) => ({
      ...prev,
      guests: undefined,
    }));

    setStatus(null);
  }

  function handleRangeSelect(range) {
    setSelectedRange(range);

    setErrors((prev) => ({
      ...prev,
      dateFrom: undefined,
      dateTo: undefined,
    }));

    setStatus(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setShowDeleteConfirm(false);

    const result = await onSave(bookingId, {
      dateFrom: toApiDate(selectedRange.from),
      dateTo: toApiDate(selectedRange.to),
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

  const nights = getNights(selectedRange?.from, selectedRange?.to);
  const totalPrice = nights * price;

  return (
    <article className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="mb-3">
          <p className="text-uppercase text-muted fw-semibold small mb-1">
            Edit
          </p>
          <h3 className="h5 mb-0">{booking?.venue?.name || "Venue"}</h3>
        </div>

        {status && (
          <div className="mb-3" aria-live="polite">
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
          <div className="mb-4">
            <label className="form-label d-block">Dates</label>

            <button
              type="button"
              className={`booking-date-toggle ${
                errors.dateFrom || errors.dateTo
                  ? "booking-date-toggle--invalid"
                  : ""
              }`}
              onClick={() => setShowCalendar((prev) => !prev)}
              aria-label="Select booking dates"
              aria-expanded={showCalendar}
            >
              {selectedRange?.from && selectedRange?.to
                ? `${toDateInputValue(selectedRange.from)} – ${toDateInputValue(
                    selectedRange.to
                  )}`
                : selectedRange?.from
                  ? `${toDateInputValue(selectedRange.from)} – Select check-out`
                  : "Select check-in and check-out dates"}
            </button>

            {showCalendar && (
              <div className="booking-calendar mt-3">
                <DayPicker
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleRangeSelect}
                  disabled={disabledDates}
                  excludeDisabled
                  min={1}
                  numberOfMonths={1}
                />
              </div>
            )}

            {(errors.dateFrom || errors.dateTo) && (
              <div className="text-danger small mt-2">
                {errors.dateFrom || errors.dateTo}
              </div>
            )}
          </div>

          <div className="mb-4">
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
              onChange={handleGuestsChange}
              required
            />
            {errors.guests ? (
              <div className="invalid-feedback">{errors.guests}</div>
            ) : (
              <div className="form-text">Max guests: {maxGuests}</div>
            )}
          </div>

          {selectedRange?.from && selectedRange?.to && (
            <div className="mb-4">
              <p className="small text-muted mb-1">
                {nights} nights × ${price}
              </p>
              <p className="h5 mb-0">${totalPrice}</p>
            </div>
          )}

          {!showDeleteConfirm && (
            <div className="d-flex justify-content-center justify-content-md-end mb-4">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting || isDeleting}
              >
                Delete booking
              </button>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-center justify-content-md-end flex-wrap">
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
