import { useState } from "react";
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

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <Loader text="Updating profile..." />
        </div>
      </div>
    );
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

        {status && (
          <Message
            variant={status.type === "error" ? "danger" : status.type}
            title={status.title}
            message={status.message}
            center={false}
          />
        )}

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
                className="btn btn-outline-danger btn-sm"
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
                className="btn btn-outline-danger btn-sm"
                onClick={handleRemoveBanner}
              >
                Remove banner
              </button>
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

            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
