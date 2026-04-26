import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function About() {
  const { auth } = useAuth();

  useEffect(() => {
    document.title = "Holidaze | About";
  }, []);

  return (
    <>
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center">
              <h1 className="mb-3">About us</h1>
            </div>

            <div>
              <p className="lead text-muted mb-3">
                Holidaze is built to make discovering and booking places feel
                simple, intuitive, and a little more enjoyable.
              </p>

              <p className="mb-3">
                Holidaze is a modern accommodation booking platform designed to
                help you find unique places to stay — whether you're planning a
                short getaway or a longer trip.
              </p>

              <p className="mb-3">
                We connect travelers with venues around the world, while keeping
                the experience clean, focused, and easy to navigate.
              </p>

              <p className="mb-0">
                Our goal is simple: create a space where booking feels less like
                a task — and more like the start of your next trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center">
              <p className="text-uppercase text-muted fw-semibold small mb-2">
                For travelers & hosts
              </p>

              <p className="h5 mb-3">Built for both sides of the journey</p>

              <p className="mb-4">
                Whether you're looking for your next stay or sharing a place of
                your own, Holidaze is designed to make the experience smooth,
                welcoming, and easy to manage.
              </p>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <Link
                  to={auth ? "/profile" : "/register"}
                  className="btn btn-accent"
                >
                  {auth ? "Go to profile" : "Get started"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center">
              <p className="text-uppercase text-muted fw-semibold small mb-2">
                We're here to help
              </p>

              <p className="h5 mb-3">Questions, feedback, or just saying hi?</p>

              <p className="mb-4">
                Whether you're planning a stay or managing a venue, we’ll do our
                best to get back to you as soon as possible.
              </p>

              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <Link to="/contact" className="btn btn-outline-primary">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
