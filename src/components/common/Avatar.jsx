import { useEffect, useState } from "react";
import { DEFAULT_AVATAR_URL } from "../../api/constants";

export default function Avatar({ src, name = "User", className = "" }) {
  const realSrc = src && src !== DEFAULT_AVATAR_URL ? src : "";
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [realSrc]);

  if (!realSrc || hasError) {
    return (
      <div
        className={`avatar-fallback d-inline-flex align-items-center justify-content-center ${className}`}
        aria-label={`${name} avatar`}
      >
        <span className="avatar-initial">
          {name?.charAt(0).toUpperCase() || "U"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={realSrc}
      alt={`${name} avatar`}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
