import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const initialProfile = {
  bio: "",
  experience_years: "",
  skills_text: "",
  availability_text: "",
  hourly_rate: "",
};

function TaskerDashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [profileStatus, setProfileStatus] = useState({
    stripe_account_id: null,
    stripe_charges_enabled: false,
    stripe_payouts_enabled: false,
  });
  const [backgroundCheck, setBackgroundCheck] = useState(null);
  const [stripeConnectBusy, setStripeConnectBusy] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    average_rating: 0,
    total_reviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [applyingTaskId, setApplyingTaskId] = useState(null);
  const [acceptingFixedTaskId, setAcceptingFixedTaskId] = useState(null);
  const [startingTaskId, setStartingTaskId] = useState(null);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [submittingActualCostTaskId, setSubmittingActualCostTaskId] = useState(null);
  const [offerByTask, setOfferByTask] = useState({});
  const [offerMsgByTask, setOfferMsgByTask] = useState({});
  const [otpByTask, setOtpByTask] = useState({});
  const [actualCostByTask, setActualCostByTask] = useState({});
  const [actualCostNoteByTask, setActualCostNoteByTask] = useState({});
  const [completionPhotoFilesByTask, setCompletionPhotoFilesByTask] = useState({});
  const [uploadingCompletionPhotoTaskId, setUploadingCompletionPhotoTaskId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!error) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [error]);

  useEffect(() => {
    if (!message) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [message]);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileRes, tasksRes, payoutsRes, reviewsRes] = await Promise.all([
        api.get("/tasker/profile"),
        api.get("/tasks"),
        api.get("/tasker/payouts"),
        user?.id ? api.get(`/taskers/${user.id}/reviews`) : Promise.resolve({ data: {} }),
      ]);

      const p = profileRes.data?.profile || {};
      setProfileStatus({
        stripe_account_id: p.stripe_account_id || null,
        stripe_charges_enabled: !!p.stripe_charges_enabled,
        stripe_payouts_enabled: !!p.stripe_payouts_enabled,
      });
      setBackgroundCheck(profileRes.data?.background_check || null);

      const taskRows = Array.isArray(tasksRes.data?.tasks?.data) ? tasksRes.data.tasks.data : [];
      setTasks(taskRows);

      const payoutRows = Array.isArray(payoutsRes.data?.payouts?.data) ? payoutsRes.data.payouts.data : [];
      setPayouts(payoutRows);

      const reviewRows = Array.isArray(reviewsRes.data?.reviews?.data) ? reviewsRes.data.reviews.data : [];
      setReviews(reviewRows);
      setReviewSummary({
        average_rating: Number(reviewsRes.data?.average_rating || 0),
        total_reviews: Number(reviewsRes.data?.total_reviews || 0),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tasker dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "tasker") {
      if (user?.role === "customer") {
        navigate("/customer/tasks");
        return;
      }
      if (user?.role === "admin") {
        navigate("/admin/service-builder");
        return;
      }
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [navigate, user?.role]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        bio: profile.bio || null,
        experience_years: profile.experience_years !== "" ? Number(profile.experience_years) : null,
        skills_text: profile.skills_text || null,
        availability_text: profile.availability_text || null,
        hourly_rate: profile.hourly_rate !== "" ? Number(profile.hourly_rate) : null,
      };
      const res = await api.put("/tasker/profile", payload);
      setBackgroundCheck(res.data?.background_check || null);
      setProfile(initialProfile);
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const applyToTask = async (taskId) => {
    setError("");
    setMessage("");
    setApplyingTaskId(taskId);
    try {
      const offerPrice = Number(offerByTask[taskId] || 0);
      if (!offerPrice || offerPrice < 1) {
        setError("Offer price must be at least 1.");
        return;
      }

      await api.post(`/tasks/${taskId}/apply`, {
        offer_price: offerPrice,
        message: offerMsgByTask[taskId] || null,
      });
      setMessage("Offer sent successfully.");
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send offer.");
    } finally {
      setApplyingTaskId(null);
    }
  };

  const acceptFixedPriceTask = async (taskId) => {
    setError("");
    setMessage("");
    setAcceptingFixedTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/accept-fixed`);
      setMessage("Task accepted at fixed price.");
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to accept fixed price task.");
    } finally {
      setAcceptingFixedTaskId(null);
    }
  };

  const verifyOtpAndStart = async (taskId) => {
    const otp = String(otpByTask[taskId] || "").trim();
    if (otp.length !== 4) {
      setError("Enter 4-digit customer OTP.");
      return;
    }

    setError("");
    setMessage("");
    setStartingTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/otp/verify-start`, { otp });
      setMessage("OTP verified and work started.");
      setOtpByTask((prev) => ({ ...prev, [taskId]: "" }));
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to verify OTP/start.");
    } finally {
      setStartingTaskId(null);
    }
  };

  const completeTask = async (taskId) => {
    setError("");
    setMessage("");
    setCompletingTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/complete`, {
        note: "Completed by tasker from dashboard",
      });
      setMessage("Task marked as completed.");
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to complete task.");
    } finally {
      setCompletingTaskId(null);
    }
  };

  const submitActualCost = async (taskId) => {
    setError("");
    setMessage("");
    setSubmittingActualCostTaskId(taskId);

    try {
      const amount = Number(actualCostByTask[taskId] || 0);
      if (!amount || amount < 1) {
        setError("Actual cost must be at least 1.");
        return;
      }

      await api.post(`/tasks/${taskId}/actual-cost`, {
        actual_cost: amount,
        note: actualCostNoteByTask[taskId] || null,
      });

      setMessage("Actual cost submitted for customer approval.");
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit actual cost.");
    } finally {
      setSubmittingActualCostTaskId(null);
    }
  };

  const startStripeConnect = async () => {
    setStripeConnectBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await api.post("/tasker/stripe/connect", {
        account_type: "express",
      });
      const url = res?.data?.onboarding_url;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      setMessage("Stripe onboarding link generated. Complete onboarding in opened tab.");
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to start Stripe Connect onboarding.");
    } finally {
      setStripeConnectBusy(false);
    }
  };

  const refreshStripeStatus = async () => {
    setStripeConnectBusy(true);
    setError("");
    setMessage("");
    try {
      await api.post("/tasker/stripe/refresh-status");
      setMessage("Stripe account status refreshed.");
      await loadDashboard();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to refresh Stripe account status.");
    } finally {
      setStripeConnectBusy(false);
    }
  };

  const uploadCompletionPhotos = async (taskId) => {
    const files = completionPhotoFilesByTask[taskId] || [];
    if (!files.length) {
      setError("Please select at least one completion photo.");
      return;
    }

    setError("");
    setMessage("");
    setUploadingCompletionPhotoTaskId(taskId);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos[]", file));
      await api.post(`/tasks/${taskId}/photos/completion`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Task completion photos uploaded successfully.");
      setCompletionPhotoFilesByTask((prev) => ({ ...prev, [taskId]: [] }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload completion photos.");
    } finally {
      setUploadingCompletionPhotoTaskId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("alpine_token");
      localStorage.removeItem("alpine_user");
      navigate("/login");
    }
  };

  const openTasks = tasks.filter((task) => task.status === "open");
  const myAssignedTasks = tasks.filter((task) => task.selected_tasker_id === user?.id);
  const inProgressTasks = myAssignedTasks.filter((task) => task.status === "in_progress").length;
  const completedTasks = myAssignedTasks.filter((task) => task.status === "completed").length;
  const pendingPayouts = payouts.filter((p) => p.status === "pending").length;

  if (loading) {
    return <main className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600">Loading tasker dashboard...</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf3ff_0%,#f7f9fe_100%)] py-8">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#1f2d6e]">Tasker Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-[#1e2756] px-5 py-2 text-sm font-semibold text-white hover:bg-[#19204a]"
            >
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p> : null}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-xl bg-[linear-gradient(135deg,#2f65d5,#244ea8)] p-3 text-white shadow-sm"><p className="text-[11px] uppercase tracking-wide text-blue-100">Open Tasks</p><p className="text-2xl font-bold">{openTasks.length}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Assigned</p><p className="text-2xl font-bold text-[#1f2d6e]">{myAssignedTasks.length}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">In Progress</p><p className="text-2xl font-bold text-[#1f2d6e]">{inProgressTasks}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Completed</p><p className="text-2xl font-bold text-[#1f2d6e]">{completedTasks}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Pending Payouts</p><p className="text-2xl font-bold text-[#1f2d6e]">{pendingPayouts}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Avg Rating</p><p className="text-2xl font-bold text-[#1f2d6e]">{reviewSummary.average_rating.toFixed(1)}</p></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-[#1f2d6e]">My Profile</h2>
              <p className="mt-1 text-xs text-slate-500">Add skills and availability for better matching.</p>
              <form className="mt-4 space-y-3" onSubmit={saveProfile}>
                <textarea
                  rows={3}
                  placeholder="Bio"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Experience (years)"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  value={profile.experience_years}
                  onChange={(e) => setProfile((prev) => ({ ...prev, experience_years: e.target.value }))}
                />
                <textarea
                  rows={2}
                  placeholder="Skills (comma separated)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={profile.skills_text}
                  onChange={(e) => setProfile((prev) => ({ ...prev, skills_text: e.target.value }))}
                />
                <textarea
                  rows={2}
                  placeholder="Availability (example: Mon-Fri 9am-6pm)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={profile.availability_text}
                  onChange={(e) => setProfile((prev) => ({ ...prev, availability_text: e.target.value }))}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Hourly rate"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  value={profile.hourly_rate}
                  onChange={(e) => setProfile((prev) => ({ ...prev, hourly_rate: e.target.value }))}
                />
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="h-10 w-full rounded-full bg-[#2f87d6] text-xs font-semibold text-white hover:bg-[#2579c2] disabled:opacity-70"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">Background Check</p>
                <p className="mt-1">Provider: {backgroundCheck?.provider || "certn"}</p>
                <p>Status: {backgroundCheck?.status || "pending"}</p>
              </div>
              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">Stripe Connect (Payouts)</p>
                <p className="mt-1">Account ID: {profileStatus.stripe_account_id || "Not connected"}</p>
                <p>Charges Enabled: {profileStatus.stripe_charges_enabled ? "Yes" : "No"}</p>
                <p>Payouts Enabled: {profileStatus.stripe_payouts_enabled ? "Yes" : "No"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={stripeConnectBusy}
                    onClick={startStripeConnect}
                    className="rounded-full bg-[#1e2756] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                  >
                    {stripeConnectBusy ? "Please wait..." : "Connect Stripe"}
                  </button>
                  <button
                    type="button"
                    disabled={stripeConnectBusy}
                    onClick={refreshStripeStatus}
                    className="rounded-full border border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-[#1f2d6e]">Available Tasks</h2>
              <p className="mt-1 text-xs text-slate-500">Browse open tasks and send your offer.</p>
              <div className="mt-4 space-y-3">
                {openTasks.length === 0 ? <p className="text-sm text-slate-500">No open tasks right now.</p> : null}
                {openTasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-3 shadow-sm">
                    <h3 className="text-base font-semibold text-[#1f2d6e]">{task.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{task.description}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Budget: ${task.budget_estimate}</span>
                      <span>City: {task.city}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <input
                        type="number"
                        min="1"
                        placeholder="Your offer price"
                        className="h-10 rounded border border-slate-200 px-3 text-xs"
                        value={offerByTask[task.id] || ""}
                        onChange={(e) => setOfferByTask((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Message (optional)"
                        className="h-10 rounded border border-slate-200 px-3 text-xs sm:col-span-2"
                        value={offerMsgByTask[task.id] || ""}
                        onChange={(e) => setOfferMsgByTask((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={applyingTaskId === task.id}
                      onClick={() => applyToTask(task.id)}
                      className="mt-2 rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                    >
                      {applyingTaskId === task.id ? "Sending..." : "Send Offer"}
                    </button>
                    <button
                      type="button"
                      disabled={acceptingFixedTaskId === task.id}
                      onClick={() => acceptFixedPriceTask(task.id)}
                      className="mt-2 ml-2 rounded-full border border-[#1e2756] px-4 py-2 text-xs font-semibold text-[#1e2756] hover:bg-[#eef2ff] disabled:opacity-70"
                    >
                      {acceptingFixedTaskId === task.id ? "Accepting..." : `Accept Fixed Price ($${task.budget_estimate})`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-[#1f2d6e]">My Assigned Tasks</h2>
              <p className="mt-1 text-xs text-slate-500">Verify OTP to start and mark tasks complete.</p>
              <div className="mt-4 space-y-3">
                {myAssignedTasks.length === 0 ? <p className="text-sm text-slate-500">No assigned tasks yet.</p> : null}
                {myAssignedTasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-[#1f2d6e]">{task.title}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase text-slate-700">
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{task.description}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Customer: {task.customer?.name || "-"}</span>
                      <span>Budget: ${task.budget_estimate}</span>
                    </div>

                    {task.status === "assigned" ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="Customer OTP"
                          className="h-10 rounded border border-slate-200 px-3 text-xs tracking-[0.2em]"
                          value={otpByTask[task.id] || ""}
                          onChange={(e) =>
                            setOtpByTask((prev) => ({ ...prev, [task.id]: e.target.value.replace(/\D/g, "").slice(0, 4) }))
                          }
                        />
                        <button
                          type="button"
                          disabled={startingTaskId === task.id}
                          onClick={() => verifyOtpAndStart(task.id)}
                          className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2678bf] disabled:opacity-70"
                        >
                          {startingTaskId === task.id ? "Starting..." : "Verify OTP & Start"}
                        </button>
                      </div>
                    ) : null}

                    {task.status === "in_progress" ? (
                      <div className="mt-3">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <input
                            type="number"
                            min="1"
                            placeholder="Actual cost"
                            className="h-10 rounded border border-slate-200 px-3 text-xs"
                            value={actualCostByTask[task.id] || ""}
                            onChange={(e) => setActualCostByTask((prev) => ({ ...prev, [task.id]: e.target.value }))}
                          />
                          <input
                            type="text"
                            placeholder="Note (optional)"
                            className="h-10 rounded border border-slate-200 px-3 text-xs sm:col-span-2"
                            value={actualCostNoteByTask[task.id] || ""}
                            onChange={(e) => setActualCostNoteByTask((prev) => ({ ...prev, [task.id]: e.target.value }))}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={submittingActualCostTaskId === task.id}
                            onClick={() => submitActualCost(task.id)}
                            className="rounded-full border border-[#2f87d6] px-4 py-2 text-xs font-semibold text-[#2f87d6] hover:bg-blue-50 disabled:opacity-70"
                          >
                            {submittingActualCostTaskId === task.id ? "Submitting..." : "Submit Actual Cost"}
                          </button>
                          <button
                            type="button"
                            disabled={completingTaskId === task.id}
                            onClick={() => completeTask(task.id)}
                            className="rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                          >
                            {completingTaskId === task.id ? "Completing..." : "Mark Complete"}
                          </button>
                        </div>
                        {task.assignment?.actual_cost_submitted_at ? (
                          <p className="mt-2 text-xs text-slate-600">
                            Submitted actual cost: ${task.assignment.actual_cost || "-"}
                            {task.assignment.actual_cost_approved_by_customer ? " | Customer approved" : " | Awaiting customer approval"}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {task.payment ? (
                      <div className="mt-3 rounded border border-green-200 bg-green-50 p-2 text-xs text-green-800">
                        <p>
                          Payment: {task.payment.status} | Net to you: ${task.payment.tasker_net_amount}
                        </p>
                        {task.payment?.payout ? (
                          <p>
                            Payout: {task.payment.payout.status}
                            {task.payment.payout.scheduled_for ? ` | Scheduled: ${new Date(task.payment.payout.scheduled_for).toLocaleString()}` : ""}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-[#1f2d6e]">Task Completion Photos</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            setCompletionPhotoFilesByTask((prev) => ({
                              ...prev,
                              [task.id]: Array.from(e.target.files || []),
                            }))
                          }
                          className="max-w-full text-xs"
                        />
                        <button
                          type="button"
                          disabled={uploadingCompletionPhotoTaskId === task.id}
                          onClick={() => uploadCompletionPhotos(task.id)}
                          className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2678bf] disabled:opacity-70"
                        >
                          {uploadingCompletionPhotoTaskId === task.id ? "Uploading..." : "Upload Completion Photos"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-[#1f2d6e]">Payouts</h2>
              <div className="mt-3 space-y-2">
                {payouts.length === 0 ? <p className="text-sm text-slate-500">No payouts yet.</p> : null}
                {payouts.map((payout) => (
                  <div key={payout.id} className="rounded border border-slate-200 px-3 py-2 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">
                      {payout.payment?.task?.title || `Task #${payout.payment?.task_id || "-"}`} - ${payout.amount}
                    </p>
                    <p>
                      Status: {payout.status}
                      {payout.scheduled_for ? ` | Scheduled: ${new Date(payout.scheduled_for).toLocaleString()}` : ""}
                      {payout.paid_at ? ` | Paid: ${new Date(payout.paid_at).toLocaleString()}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-semibold text-[#1f2d6e]">Ratings & Reviews</h2>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                  <p className="text-slate-500">Average Rating</p>
                  <p className="text-lg font-semibold text-[#1f2d6e]">{reviewSummary.average_rating.toFixed(2)} / 5</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                  <p className="text-slate-500">Total Reviews</p>
                  <p className="text-lg font-semibold text-[#1f2d6e]">{reviewSummary.total_reviews}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {reviews.length === 0 ? <p className="text-sm text-slate-500">No reviews yet.</p> : null}
                {reviews.slice(0, 8).map((review) => (
                  <div key={review.id} className="rounded border border-slate-200 px-3 py-2 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">
                      {review.task?.title || `Task #${review.task_id}`} - {review.rating}/5
                    </p>
                    <p>Customer: {review.customer?.name || "-"}</p>
                    <p>{review.comment || "No comment provided."}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TaskerDashboardPage;
