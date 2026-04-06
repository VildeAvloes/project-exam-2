import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/common/Layout";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Venues from "./pages/Venues";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venue/:id" element={<Venue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
