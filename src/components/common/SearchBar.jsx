import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { searchInput, setSearchInput } = useSearch();

  useEffect(() => {
    const queryFromUrl = searchParams.get("q") || "";

    if (location.pathname === "/venues") {
      setSearchInput(queryFromUrl);
    }
  }, [location.pathname, searchParams, setSearchInput]);

  function handleChange(event) {
    setSearchInput(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = searchInput.trim();

    if (trimmedQuery) {
      navigate(`/venues?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/venues");
    }
  }

  return (
    <div className="bg-light py-3">
      <div className="container">
        <form
          className="d-flex justify-content-center"
          onSubmit={handleSubmit}
          role="search"
        >
          <div className="d-flex w-100 w-lg-50 gap-2">
            <input
              className="form-control"
              type="search"
              placeholder="Search venues"
              value={searchInput}
              onChange={handleChange}
              aria-label="Search venues"
            />

            <button className="btn btn-primary btn-icon" type="submit">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
