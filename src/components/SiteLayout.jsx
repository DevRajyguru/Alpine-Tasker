import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function SiteLayout() {
  return (
    <div className="bg-white text-slate-900">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default SiteLayout;
