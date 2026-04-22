import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth/login";
import { createApiKey } from "../api/auth/createApiKey";
import { saveAuth } from "../utils/storage/saveAuth";
import { useAuth } from "../contexts/AuthContext";
import Message from "../components/common/Message";
import Loader from "../components/common/Loader";

export default function Login() {
  const navigate = useNavigate();
  const { auth, setAuth, loading: authLoading } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Holidaze | Login";
  }, []);

  function validate(formValues) {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
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
      const user = await loginUser(values);
      const apiKey = await createApiKey(user.accessToken);

      const authData = {
        name: user.name,
        email: user.email,
        venueManager: user.venueManager,
        avatar: user.avatar,
        banner: user.banner,
        accessToken: user.accessToken,
        apiKey,
      };

      saveAuth(authData);
      setAuth(authData);

      setStatus({
        type: "success",
        title: "Login successful",
        message: "Redirecting to your profile...",
      });

      navigate("/profile");
    } catch (error) {
      setStatus({
        type: "error",
        title: "Login failed",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return <Loader text="Checking session..." />;
  }

  if (auth) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <h1 className="mb-3">Login</h1>
            <p className="text-muted mb-0">
              Sign in to manage bookings or venues.
            </p>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-lg-5">
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

              <form onSubmit={handleSubmit} noValidate>
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

                <div className="mb-4">
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

                <div className="d-flex justify-content-center mb-4">
                  <button
                    className="btn btn-primary w-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>

                <p className="text-center text-muted mb-0">
                  Don’t have an account yet?{" "}
                  <Link to="/register" className="auth-link">
                    Register
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
