import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "Holidaze | About";
  }, []);

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="text-center mb-4">
            <h1 className="mb-3">About Holidaze</h1>
            <p className="text-muted mb-0">
              Learn more about out beloved company.
            </p>
          </div>

          <div className=" p-4 p-lg-5">
            <p className="mb-3">
              Holidaze is a modern accommodation booking platform designed to
              make it easy to find and book unique places to stay.
            </p>

            <p className="mb-3">
              Whether you’re planning a weekend getaway or a longer trip,
              Holidaze connects travelers with venues around the world.
            </p>

            <p className="mb-0">
              Our goal is to provide a simple, intuitive experience for both
              guests and venue managers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
