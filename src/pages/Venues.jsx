import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSliders, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getVenues } from "../api/venues/getVenues";
import VenueCard from "../components/venues/VenueCard";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import { useSearch } from "../contexts/SearchContext";

const ITEMS_PER_PAGE = 12;

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push("start-ellipsis");
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("end-ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export default function Venues() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { setSearchInput } = useSearch();

  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
        setLoading(true);

        const data = await getVenues();
        console.log("venues:", data);
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
    setCurrentPage(1);
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

  const totalPages = Math.ceil(sortedVenues.length / ITEMS_PER_PAGE);

  const paginatedVenues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return sortedVenues.slice(startIndex, endIndex);
  }, [sortedVenues, currentPage]);

  const paginationItems = useMemo(() => {
    return getPaginationItems(currentPage, totalPages);
  }, [currentPage, totalPages]);

  function handleSortChange(event) {
    setSortOrder(event.target.value);
  }

  function handleClearSearch() {
    setSearchInput("");
    navigate("/venues");
  }

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }

  if (loading) {
    return <Loader text="Loading venues..." />;
  }

  if (status?.type === "error") {
    return (
      <Message variant="danger" title={status.title} message={status.message} />
    );
  }

  if (status?.type === "info") {
    return (
      <Message variant="info" title={status.title} message={status.message} />
    );
  }

  if (!sortedVenues.length && query.trim()) {
    return (
      <section className="container py-5">
        <Message
          variant="info"
          title="No matching venues"
          message={`No venues matched "${query}". Try a different search.`}
        />
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-12 col-lg-8">
          <h1 className="mb-3">Browse venues</h1>
          <p className="text-muted mb-0">
            Explore all available venues and discover places that match your
            plans.
          </p>
        </div>
      </div>

      <div className="venues-toolbar border-0  mb-4">
        <div className=" p-3 p-lg-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <p className="mb-0 text-muted small mt-1">
                {sortedVenues.length} venues found
              </p>

              {query.trim() && (
                <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                  <span className="venues-search-tag">
                    Results for "{query}"
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClearSearch}
                  >
                    <FiX />
                    <span>Clear search</span>
                  </button>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 venues-sort-wrap">
              <label
                htmlFor="sortOrder"
                className="form-label mb-0 d-inline-flex align-items-center gap-2"
              >
                <FiSliders />
                <span>Sort</span>
              </label>

              <select
                id="sortOrder"
                className="form-select venues-sort-select"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {paginatedVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="d-flex justify-content-center mt-5"
          aria-label="Venue pagination"
        >
          <div className="venues-pagination">
            <button
              type="button"
              className="venues-page-btn venues-page-btn--nav"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
              <span>Prev</span>
            </button>

            {paginationItems.map((item, index) => {
              if (typeof item !== "number") {
                return (
                  <span
                    key={`${item}-${index}`}
                    className="venues-pagination-ellipsis"
                  >
                    ...
                  </span>
                );
              }

              const isActive = item === currentPage;

              return (
                <button
                  key={item}
                  type="button"
                  className={`venues-page-btn ${
                    isActive ? "venues-page-btn--active" : ""
                  }`}
                  onClick={() => handlePageChange(item)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item}
                </button>
              );
            })}

            <button
              type="button"
              className="venues-page-btn venues-page-btn--nav"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
