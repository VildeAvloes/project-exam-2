export default function Message({
  variant = "info",
  title,
  message,
  center = true,
}) {
  return (
    <div className={`container ${center ? "py-5 text-center" : ""}`}>
      <div className={`alert alert-${variant} mb-0`} role="alert">
        {title && <p className="h6 mb-2">{title}</p>}
        {message && <p className="mb-0">{message}</p>}
      </div>
    </div>
  );
}
