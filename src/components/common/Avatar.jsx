import { useState } from "react";

export default function Avatar({
  src,
  name = "User",
  alt,
  className = "",
  fallbackClassName = "",
}) {
  const [hasError, setHasError] = useState(false);
  const initial = name?.charAt(0).toUpperCase() || "U";

  if (!src || hasError) {
    return (
      <div
        className={`avatar-fallback d-inline-flex align-items-center justify-content-center ${className} ${fallbackClassName}`}
      >
        <span>{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || `${name} avatar`}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
