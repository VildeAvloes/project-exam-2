import { useState } from "react";
import { createBooking } from "../../api/bookings/createBooking";
import Message from "../common/Message";

function getTodayAsDateInput() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingForm({ venueId, maxGuests, embedded = false }) {
  const initialValues = {
    dateFrom: "",
    dateTo: "",
    guests: 1,
  };

  const today = getTodayAsDateInput();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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
      newErrors.dateTo = "Check-out must be after check-in";
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

    setLoading(true);

    try {
      await createBooking({
        dateFrom: values.dateFrom,
        dateTo: values.dateTo,
        guests: Number(values.guests),
        venueId,
      });

      setStatus({
        type: "success",
        message: "Booking created successfully.",
      });

      setValues(initialValues);
      setErrors({});
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
        <div className="mb-3">
          <Message
            variant={status.type === "error" ? "danger" : status.type}
            title={status.title}
            message={status.message}
            center={false}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="dateFrom">
              Check-in
            </label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              className={`form-control ${errors.dateFrom ? "is-invalid" : ""}`}
              value={values.dateFrom}
              onChange={handleChange}
              min={today}
              required
            />
            {errors.dateFrom && (
              <div className="invalid-feedback">{errors.dateFrom}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="dateTo">
              Check-out
            </label>
            <input
              id="dateTo"
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

          <div className="col-12">
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

        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book now"}
          </button>
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
