import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<Venue />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
