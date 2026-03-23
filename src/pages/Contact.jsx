import { useEffect, useState } from "react";

export default function Contact() {
  const initialValues = {
    fullName: "",
    email: "",
    subject: "",
    body: "",
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate(formValues) {
    const newErrors = {};

    if (formValues.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formValues.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (formValues.body.trim().length < 3) {
      newErrors.body = "Message must be at least 3 characters";
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

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Contact form data:", values);
      setIsSubmitted(true);
      setValues(initialValues);
    } else {
      setIsSubmitted(false);
    }
  }

  useEffect(() => {
    document.title = "Holidaze | Contact";
  }, []);

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="text-center">
            <h1 className="mb-3">Contact</h1>
            {!isSubmitted ? (
              <p className="text-muted mb-0">
                Send us a message and we’ll get back to you.
              </p>
            ) : (
              <div className="alert alert-success " role="alert">
                Your message has been submitted.
              </div>
            )}
          </div>

          <div className="p-4 p-lg-5">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="fullName">
                  Full name
                </label>
                <input
                  className={`form-control ${
                    errors.fullName ? "is-invalid" : ""
                  }`}
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
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
                <label className="form-label" htmlFor="subject">
                  Subject
                </label>
                <input
                  className={`form-control ${
                    errors.subject ? "is-invalid" : ""
                  }`}
                  id="subject"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={handleChange}
                />
                {errors.subject && (
                  <div className="invalid-feedback">{errors.subject}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="body">
                  Message
                </label>
                <textarea
                  className={`form-control ${errors.body ? "is-invalid" : ""}`}
                  id="body"
                  name="body"
                  rows="6"
                  value={values.body}
                  onChange={handleChange}
                />
                {errors.body && (
                  <div className="invalid-feedback">{errors.body}</div>
                )}
              </div>

              <button className="btn btn-primary w-100 " type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
