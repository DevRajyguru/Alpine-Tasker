import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AdminLayout from "./components/AdminLayout";
import CookieConsentBanner from "./components/CookieConsentBanner";
import SiteLayout from "./components/SiteLayout";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ContactUsPage from "./pages/ContactUsPage";
import CustomerDynamicTaskPage from "./pages/CustomerDynamicTaskPage";
import CustomerTasksPage from "./pages/CustomerTasksPage";
import DisputesPage from "./pages/DisputesPage";
import HomePage from "./pages/HomePage";
import LoginHtmlPage from "./pages/LoginHtmlPage";
import AdminServiceBuilderPage from "./pages/AdminServiceBuilderPage";
import AdminBackgroundChecksPage from "./pages/AdminBackgroundChecksPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDisputesPage from "./pages/AdminDisputesPage";
import AdminEarningsPage from "./pages/AdminEarningsPage";
import AdminLockScreenPage from "./pages/AdminLockScreenPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminCommissionsPage from "./pages/AdminCommissionsPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import AdminTransactionsPage from "./pages/AdminTransactionsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminTaskersPage from "./pages/AdminTaskersPage";
import PosterPage from "./pages/PosterPage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";
import SignupPage from "./pages/SignupPage";
import TaskerDashboardPage from "./pages/TaskerDashboardPage";
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
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/lock" element={<AdminLockScreenPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="service-builder" element={<AdminServiceBuilderPage />} />
          <Route path="background-checks" element={<AdminBackgroundChecksPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="taskers" element={<AdminTaskersPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
          <Route path="commissions" element={<AdminCommissionsPage />} />
          <Route path="disputes" element={<AdminDisputesPage />} />
          <Route path="earnings" element={<AdminEarningsPage />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/tasker" element={<TaskerPage />} />
          <Route path="/customer/tasks" element={<CustomerTasksPage />} />
          <Route path="/tasker/dashboard" element={<TaskerDashboardPage />} />
          <Route path="/customer/dynamic-task" element={<CustomerDynamicTaskPage />} />
          <Route path="/disputes" element={<DisputesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
