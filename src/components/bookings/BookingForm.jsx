import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { createBooking } from "../../api/bookings/createBooking";
import Message from "../common/Message";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function toDateInputValue(date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

function toApiDate(date) {
  return new Date(date).toISOString();
}

function getDisabledBookingRanges(bookings = []) {
  return bookings
    .filter((booking) => booking.dateFrom && booking.dateTo)
    .map((booking) => ({
      from: new Date(booking.dateFrom),
      to: new Date(booking.dateTo),
    }));
}

function getNights(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) return 0;

  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  const diffMs = end - start;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.max(diffDays, 0);
}

export default function BookingForm({
  venueId,
  maxGuests,
  bookings = [],
  onBookingCreated,
  price,
  embedded = false,
}) {
  const { auth } = useAuth();
  const isLoggedIn = Boolean(auth?.accessToken);
  const initialValues = {
    guests: 1,
  };

  const today = getToday();
  const disabledDates = [
    { before: today },
    ...getDisabledBookingRanges(bookings),
  ];

  const [selectedRange, setSelectedRange] = useState();
  const [showCalendar, setShowCalendar] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const nights = getNights(selectedRange?.from, selectedRange?.to);
  const totalPrice = nights * price;

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
      newErrors.dateTo = "Check-out must be after check-in";
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

    setLoading(true);

    try {
      await createBooking({
        dateFrom: toApiDate(selectedRange.from),
        dateTo: toApiDate(selectedRange.to),
        guests: Number(values.guests),
        venueId,
      });

      setStatus({
        type: "success",
        title: "Booking created",
        message: "Your booking was created successfully.",
      });

      setSelectedRange(undefined);
      setValues(initialValues);
      setErrors({});

      if (onBookingCreated) {
        onBookingCreated();
      }
    } catch (error) {
      setStatus({
        type: "error",
        title: "Booking failed",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  const formContent = (
    <>
      {!embedded && <h2 className="h5 mb-4">Book this venue</h2>}

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

      {!isLoggedIn && (
        <div className="mb-3">
          <Message
            variant="info"
            title="Login required"
            message="Please log in to book this venue."
          />
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
          <label className="form-label" htmlFor="guests">
            Guests
          </label>
          <input
            id="guests"
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

            <span className="visually-hidden">Total price</span>
            <p className="h5 mb-0">${totalPrice}</p>
          </div>
        )}

        <div className="d-flex justify-content-end mt-4">
          {isLoggedIn ? (
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book now"}
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary">
              Log in to book
            </Link>
          )}
        </div>
      </form>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="card shadow-sm mt-4 border-0">
      <div className="card-body p-4">{formContent}</div>
    </div>
  );
}
