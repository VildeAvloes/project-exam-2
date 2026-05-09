import { useEffect, useState } from "react";

import { DEFAULT_BANNER_URL } from "../../api/constants";
import Avatar from "../common/Avatar";

export default function ProfileHeader({ auth, onEdit }) {
  const avatarUrl = auth.avatar?.url || "";

  const bannerUrl =
    auth.banner?.url && auth.banner.url !== DEFAULT_BANNER_URL
      ? auth.banner.url
      : "";

  const [bannerSrc, setBannerSrc] = useState(bannerUrl);

  useEffect(() => {
    setBannerSrc(bannerUrl);
  }, [bannerUrl]);

  return (
    <section className="card shadow-sm border-0 rounded overflow-hidden">
      {bannerSrc ? (
        <img
          src={bannerSrc}
          alt={`${auth.name} banner`}
          className="banner img-fluid"
          onError={() => setBannerSrc("")}
        />
      ) : (
        <div className="banner banner-color" />
      )}

      <div className="card-body p-4 p-lg-5">
        <div className="text-center">
          <Avatar
            src={avatarUrl}
            name={auth.name}
            className="avatar rounded-circle img-fluid mb-3"
          />

          <h1 className="h3 mb-1">{auth.name}</h1>
          <p className="text-muted mb-3">{auth.email}</p>

          <div className="d-flex justify-content-center mb-4">
            <span className="profile-account-badge">
              {auth.venueManager ? "Venue Manager" : "Traveler"}
            </span>
          </div>

          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-accent" onClick={onEdit}>
              Edit profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
