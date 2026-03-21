export default function SearchBar() {
  function handleSubmit(event) {
    event.preventDefault();
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
