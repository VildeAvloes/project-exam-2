import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/common/Layout";
import Register from "./pages/Register";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue/:id" element={<Venue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
