import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth/register";
import Message from "../components/common/Message";

export default function Register() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    venueManager: false,
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Holidaze | Register";
  }, []);

  function validate(formValues) {
    const newErrors = {};

    if (!/^[a-zA-Z0-9_]+$/.test(formValues.name)) {
      newErrors.name =
        "Name can only contain letters, numbers, and underscore (_)";
    }

    if (!/^[^\s@]+@stud\.noroff\.no$/.test(formValues.email)) {
      newErrors.email = "Email must be a valid stud.noroff.no address";
    }

    if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitted(false);

    console.log("📝 Register values:", values);

    const validationErrors = validate(values);
    console.log("❌ Validation errors:", validationErrors);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(values);
      console.log("✅ Register response:", result);

      setIsSubmitted(true);
      setValues(initialValues);

      setStatus({
        type: "success",
        message: "Register successful. Redirecting...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("❌ Register error:", error);
      setStatus({
        type: "error",
        title: "Login failed",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <h1 className="mb-3">Register</h1>
            {!isSubmitted ? (
              <p className="text-muted mb-0">
                Create an account to book venues or manage your own.
              </p>
            ) : (
              <div className="alert alert-success mb-0" role="alert">
                Your account has been created. Redirecting to login...
              </div>
            )}
          </div>

          <div className="card shadow">
            <div className="card-body p-4 p-lg-5">
              {status && (
                <Message
                  variant={status.type === "error" ? "danger" : status.type}
                  title={status.title}
                  message={status.message}
                  center={false}
                />
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    id="name"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    id="venueManager"
                    name="venueManager"
                    type="checkbox"
                    checked={values.venueManager}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="venueManager">
                    Register as venue manager
                  </label>
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-secondary w-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
