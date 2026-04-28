import { useState } from "react";
import { FiX } from "react-icons/fi";
import { updateProfile } from "../../api/profile/updateProfile";
import { saveAuth } from "../../utils/storage/saveAuth";
import Loader from "../common/Loader";
import Message from "../common/Message";

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
  const [status, setStatus] = useState(null);

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
    setStatus(null);

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

      if (Object.keys(payload).length > 0) {
        await updateProfile(payload);
      }

      const updatedAuth = {
        ...auth,
        avatar:
          avatarRemoved || !avatarUrl.trim()
            ? null
            : {
                url: avatarUrl.trim(),
                alt: `${auth.name} avatar`,
              },
        banner:
          bannerRemoved || !bannerUrl.trim()
            ? null
            : {
                url: bannerUrl.trim(),
                alt: `${auth.name} banner`,
              },
      };

      saveAuth(updatedAuth);
      setAuth(updatedAuth);

      setStatus({
        type: "success",
        message: "Profile updated successfully.",
      });

      setAvatarRemoved(false);
      setBannerRemoved(false);
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
          <div className="mb-3">
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
              onChange={(event) => {
                setAvatarUrl(event.target.value);
                setAvatarRemoved(false);
              }}
              placeholder="Paste image URL"
            />

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-outline-danger"
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
              type="url"
              className="form-control"
              value={bannerUrl}
              onChange={(event) => {
                setBannerUrl(event.target.value);
                setBannerRemoved(false);
              }}
              placeholder="Paste image URL"
            />

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleRemoveBanner}
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
