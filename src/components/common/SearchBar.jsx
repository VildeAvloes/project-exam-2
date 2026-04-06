import { useNavigate } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";

export default function SearchBar() {
  const navigate = useNavigate();
  const { search, setSearch } = useSearch();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/venues");
  }

  return (
    <div className="bg-light py-3">
      <div className="container">
        <form className="d-flex justify-content-center" onSubmit={handleSubmit}>
          <div className="d-flex w-100 w-lg-50 gap-2">
            <input
              className="form-control"
              type="search"
              placeholder="Search venues"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
