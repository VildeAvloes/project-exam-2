export default function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-grow text-primary mb-3" role="status" />
      <p className="text-muted mb-0">{text}</p>
    </div>
  );
}
