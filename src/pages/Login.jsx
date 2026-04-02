import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth/login";
import { createApiKey } from "../api/auth/createApiKey";
import { saveAuth } from "../utils/storage/saveAuth";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
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
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");

    console.log("Login values:", values);

    const validationErrors = validate(values);
    console.log("Validation errors:", validationErrors);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(values);
      console.log("Login response:", user);

      const apiKey = await createApiKey(user.accessToken);
      console.log("API key:", apiKey);

      const authData = {
        name: user.name,
        email: user.email,
        venueManager: user.venueManager,
        avatar: user.avatar,
        accessToken: user.accessToken,
        apiKey,
      };

      console.log("Saving auth:", authData);

      saveAuth(authData);
      setAuth(authData);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setApiError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
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

          <div className="card shadow">
            <div className="card-body p-4 p-lg-5">
              {apiError && (
                <div className="alert alert-danger" role="alert">
                  {apiError}
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

                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary w-50"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
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
