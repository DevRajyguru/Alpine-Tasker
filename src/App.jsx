import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import SiteLayout from "./components/SiteLayout";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ContactUsPage from "./pages/ContactUsPage";
import HomePage from "./pages/HomePage";
import LoginHtmlPage from "./pages/LoginHtmlPage";
import PosterPage from "./pages/PosterPage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";
import SignupPage from "./pages/SignupPage";
import TaskerPage from "./pages/TaskerPage";
import VerifiedTaskerPage from "./pages/VerifiedTaskerPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/poster" element={<PosterPage />} />
        <Route path="/verified-tasker" element={<VerifiedTaskerPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginHtmlPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/tasker" element={<TaskerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
