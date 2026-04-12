import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getVenues } from "../api/venues/getVenues";
import VenueCard from "../components/venues/VenueCard";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import { useSearch } from "../contexts/SearchContext";

const STEP = 12;

export default function Venues() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { setSearchInput } = useSearch();

  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(STEP);
  const [sortOrder, setSortOrder] = useState("az");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Holidaze | Venues";
  }, []);

  useEffect(() => {
    setSearchInput(query);
  }, [query, setSearchInput]);

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await getVenues();
        setVenues(data);

        if (!data.length) {
          setStatus({
            type: "info",
            title: "No venues found",
            message: "There are no venues to display right now.",
          });
        } else {
          setStatus(null);
        }
      } catch (err) {
        setStatus({
          type: "error",
          title: "Something went wrong",
          message: err.message || "Failed to load venues.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  useEffect(() => {
    setVisibleCount(STEP);
  }, [query, sortOrder]);

  const filteredVenues = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return venues;
    }

    return venues.filter((venue) => {
      const name = venue.name?.toLowerCase() || "";
      const city = venue.location?.city?.toLowerCase() || "";
      const country = venue.location?.country?.toLowerCase() || "";

      return (
        name.includes(normalizedQuery) ||
        city.includes(normalizedQuery) ||
        country.includes(normalizedQuery)
      );
    });
  }, [venues, query]);

  const sortedVenues = useMemo(() => {
    const copy = [...filteredVenues];

    copy.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";

      return sortOrder === "za"
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB);
    });

    return copy;
  }, [filteredVenues, sortOrder]);

  const visibleVenues = sortedVenues.slice(0, visibleCount);
  const hasMore = visibleCount < sortedVenues.length;
  const canShowLess = visibleCount > STEP;

  function handleLoadMore() {
    setVisibleCount((prev) => prev + STEP);
  }

  function handleShowLess() {
    setVisibleCount(STEP);
  }

  function handleSortChange(event) {
    setSortOrder(event.target.value);
  }

  function handleClearSearch() {
    setSearchInput("");
    navigate("/venues");
  }

  if (loading) {
    return <Loader text="Loading venues..." />;
  }

  if (status && status.type === "error") {
    return (
      <Message variant="danger" title={status.title} message={status.message} />
    );
  }

  if (status && status.type === "info") {
    return (
      <Message variant="info" title={status.title} message={status.message} />
    );
  }

  if (!sortedVenues.length && query.trim()) {
    return (
      <Message
        variant="info"
        title="No matching venues"
        message={`No venues matched "${query}". Try a different search.`}
      />
    );
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-8">
          <p className="text-uppercase text-muted fw-semibold mb-2">
            Browse venues
          </p>
          <h1 className="mb-3">Find the right stay for your next trip</h1>
          <p className="text-muted mb-0">
            Explore all available venues and discover places that match your
            plans.
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <p className="mb-0 text-muted">
            Showing {visibleVenues.length} of {sortedVenues.length} venues
          </p>

          {query.trim() && (
            <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
              <p className="mb-0 small text-muted">Results for "{query}"</p>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClearSearch}
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sortOrder" className="form-label mb-0">
            Sort
          </label>
          <select
            id="sortOrder"
            className="form-select"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {visibleVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      <div className="d-flex justify-content-center gap-2 mt-5 flex-wrap">
        {canShowLess && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleShowLess}
          >
            Show less
          </button>
        )}

        {hasMore && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        )}
      </div>
    </section>
  );
}
