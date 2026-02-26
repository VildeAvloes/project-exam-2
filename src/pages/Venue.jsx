import { useParams } from "react-router-dom";

export default function Venue() {
  const { id } = useParams();
  return <h1>Venue {id}</h1>;
}
