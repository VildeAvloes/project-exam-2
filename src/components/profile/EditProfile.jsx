import { useState } from "react";
import { updateProfile } from "../../api/profile/updateProfile";
import { saveAuth } from "../../utils/storage/saveAuth";

export default function EditProfile({ auth, setAuth, onCancel }) {
  const [avatarUrl, setAvatarUrl] = useState(
    auth.avatar?.url || auth.avatar || ""
  );
  const [bannerUrl, setBannerUrl] = useState(
    auth.banner?.url || auth.banner || ""
  );

  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [bannerRemoved, setBannerRemoved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  function handleRemoveAvatar() {
    setAvatarUrl("");
    setAvatarRemoved(true);
  }

  function handleRemoveBanner() {
    setBannerUrl("");
    setBannerRemoved(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {};

      if (!avatarRemoved && avatarUrl.trim()) {
        payload.avatar = {
          url: avatarUrl.trim(),
          alt: `${auth.name} avatar`,
        };
      }

      if (!bannerRemoved && bannerUrl.trim()) {
        payload.banner = {
          url: bannerUrl.trim(),
          alt: `${auth.name} banner`,
        };
      }

      let updatedProfile = null;

      if (Object.keys(payload).length > 0) {
        updatedProfile = await updateProfile(payload);
      }

      const updatedAuth = {
        ...auth,
        avatar: avatarRemoved ? null : (updatedProfile?.avatar ?? auth.avatar),
        banner: bannerRemoved ? null : (updatedProfile?.banner ?? auth.banner),
      };

      saveAuth(updatedAuth);
      setAuth(updatedAuth);

      setSuccessMessage("Profile updated successfully.");
      setAvatarRemoved(false);
      setBannerRemoved(false);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 mb-0">Edit profile</h2>

          <button type="button" className="btn btn-icon" onClick={onCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="avatarUrl">
              Avatar URL
            </label>

            <input
              id="avatarUrl"
              type="text"
              className="form-control"
              value={avatarUrl}
              onChange={(e) => {
                setAvatarUrl(e.target.value);
                setAvatarRemoved(false);
              }}
              placeholder="Paste image URL"
            />

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleRemoveAvatar}
              >
                Remove avatar
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="bannerUrl">
              Banner URL
            </label>

            <input
              id="bannerUrl"
              type="text"
              className="form-control"
              value={bannerUrl}
              onChange={(e) => {
                setBannerUrl(e.target.value);
                setBannerRemoved(false);
              }}
              placeholder="Paste image URL"
            />

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleRemoveBanner}
              >
                Remove banner
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h6 mb-3">Preview</h3>

            <div className="mb-3">
              {bannerRemoved || !bannerUrl ? (
                <div className="profile-banner profile-banner-fallback" />
              ) : (
                <img
                  src={bannerUrl}
                  alt="Banner preview"
                  className="profile-banner img-fluid"
                />
              )}
            </div>

            <div className="text-center">
              {avatarRemoved || !avatarUrl ? (
                <div className="profile-avatar profile-avatar-fallback rounded-circle" />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="profile-avatar rounded-circle img-fluid"
                />
              )}
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-center justify-content-lg-end">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
