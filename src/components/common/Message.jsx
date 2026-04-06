export default function Message({
  variant = "info",
  title,
  message,
  center = true,
}) {
  return (
    <div className={`container ${center ? "py-5 text-center" : ""}`}>
      <div className={`alert alert-${variant} mb-0`} role="alert">
        {title && <h2 className="h6 mb-2">{title}</h2>}
        {message && <p className="mb-0">{message}</p>}
      </div>
    </div>
  );
}
