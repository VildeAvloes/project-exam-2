import { useState } from "react";
import { FiX } from "react-icons/fi";
import { DEFAULT_AVATAR_URL, DEFAULT_BANNER_URL } from "../../api/constants";
import { updateProfile } from "../../api/profile/updateProfile";

import Loader from "../common/Loader";
import Message from "../common/Message";

import { saveAuth } from "../../utils/storage/saveAuth";

export default function EditProfile({ auth, setAuth, onCancel }) {
  const initialAvatarUrl =
    auth.avatar?.url === DEFAULT_AVATAR_URL ? "" : auth.avatar?.url || "";

  const initialBannerUrl =
    auth.banner?.url === DEFAULT_BANNER_URL ? "" : auth.banner?.url || "";

  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [bannerUrl, setBannerUrl] = useState(initialBannerUrl);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function handleRemoveAvatar() {
    setAvatarUrl(DEFAULT_AVATAR_URL);
  }

  function handleRemoveBanner() {
    setBannerUrl(DEFAULT_BANNER_URL);
  }

  function handleAvatarChange(event) {
    setAvatarUrl(event.target.value);
  }

  function handleBannerChange(event) {
    setBannerUrl(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const payload = {
        avatar: {
          url: avatarUrl.trim() || DEFAULT_AVATAR_URL,
          alt: `${auth.name} avatar`,
        },
        banner: {
          url: bannerUrl.trim() || DEFAULT_BANNER_URL,
          alt: `${auth.name} banner`,
        },
      };

      await updateProfile(payload);

      const updatedAuth = {
        ...auth,
        avatar: payload.avatar,
        banner: payload.banner,
      };

      saveAuth(updatedAuth);
      setAuth(updatedAuth);

      setStatus({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        title: "Something went wrong",
        message: err.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase text-muted fw-semibold small mb-1">
              Edit
            </p>
            <h2 className="h5 mb-0">Update profile images</h2>
          </div>

          <button
            type="button"
            className="btn btn-icon"
            onClick={onCancel}
            aria-label="Close edit profile"
          >
            <FiX />
          </button>
        </div>

        {loading && (
          <div className="mb-4">
            <Loader text="Updating profile..." />
          </div>
        )}

        {status && (
          <div className="mb-3" aria-live="polite">
            <Message
              variant={status.type === "error" ? "danger" : status.type}
              title={status.title}
              message={status.message}
              center={false}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="avatarUrl">
              Avatar URL
            </label>

            <input
              id="avatarUrl"
              type="url"
              className="form-control"
              value={avatarUrl}
              onChange={handleAvatarChange}
              placeholder="Paste image URL"
            />

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleRemoveAvatar}
                disabled={loading}
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
              type="url"
              className="form-control"
              value={bannerUrl}
              onChange={handleBannerChange}
              placeholder="Paste image URL"
            />

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleRemoveBanner}
                disabled={loading}
              >
                Remove banner
              </button>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-center justify-content-md-end flex-wrap">
            <button
              type="button"
              className="btn btn-outline-accent"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
