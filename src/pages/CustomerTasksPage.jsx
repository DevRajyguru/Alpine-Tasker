import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const initialForm = {
  category_id: "1",
  title: "",
  description: "",
  budget_estimate: "",
  scheduled_at: "",
  address: "",
  city: "",
};

const extractApiError = (err, fallback) => {
  const message = err?.response?.data?.message;
  const errors = err?.response?.data?.errors;
  if (message && errors && typeof errors === "object") {
    const detail = Object.values(errors).flat().join(" | ");
    return detail ? `${message} ${detail}` : message;
  }
  return message || fallback;
};

function CustomerTasksPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payingTaskId, setPayingTaskId] = useState(null);
  const [capturingPaymentId, setCapturingPaymentId] = useState(null);
  const [payAfterTaskId, setPayAfterTaskId] = useState(null);
  const [otpTaskId, setOtpTaskId] = useState(null);
  const [otpMap, setOtpMap] = useState({});
  const [applicantsByTask, setApplicantsByTask] = useState({});
  const [loadingApplicantsTaskId, setLoadingApplicantsTaskId] = useState(null);
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [confirmingCompletionTaskId, setConfirmingCompletionTaskId] = useState(null);
  const [closingTaskId, setClosingTaskId] = useState(null);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewSubmittingTaskId, setReviewSubmittingTaskId] = useState(null);
  const [paymentAmountByTask, setPaymentAmountByTask] = useState({});
  const [couponCodeByTask, setCouponCodeByTask] = useState({});
  const [customerPhotoFilesByTask, setCustomerPhotoFilesByTask] = useState({});
  const [uploadingCustomerPhotoTaskId, setUploadingCustomerPhotoTaskId] = useState(null);
  const [approvingActualCostTaskId, setApprovingActualCostTaskId] = useState(null);
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

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks");
      const rows = Array.isArray(res.data?.tasks?.data) ? res.data.tasks.data : [];
      setTasks(rows);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      const rows = Array.isArray(res.data?.categories) ? res.data.categories : [];
      setCategories(rows);
      if (rows.length > 0) {
        setForm((prev) => ({
          ...prev,
          category_id: prev.category_id || String(rows[0].id),
        }));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load categories.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "customer") {
      setError("Only customer accounts can access this page.");
      setLoading(false);
      return;
    }

    (async () => {
      await Promise.all([loadTasks(), loadCategories()]);
    })();
  }, [navigate, user?.role]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        budget_estimate: Number(form.budget_estimate),
        scheduled_at: form.scheduled_at || null,
      };

      await api.post("/tasks", payload);
      setMessage("Task created successfully.");
      setForm(initialForm);
      await loadTasks();
    } catch (err) {
      setError(extractApiError(err, "Task create failed."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelTask = async (taskId) => {
    setError("");
    setMessage("");
    try {
      await api.post(`/tasks/${taskId}/cancel`, { note: "Cancelled by customer from UI" });
      setMessage("Task cancelled.");
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Task cancel failed.");
    }
  };

  const loadApplicants = async (taskId) => {
    setError("");
    setMessage("");
    setLoadingApplicantsTaskId(taskId);
    try {
      const res = await api.get(`/tasks/${taskId}`);
      const apps = Array.isArray(res.data?.task?.applications) ? res.data.task.applications : [];
      setApplicantsByTask((prev) => ({ ...prev, [taskId]: apps }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load applicants.");
    } finally {
      setLoadingApplicantsTaskId(null);
    }
  };

  const assignTasker = async (taskId, taskerId, offerPrice) => {
    setError("");
    setMessage("");
    setAssigningTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/assign/${taskerId}`, {
        assigned_price: offerPrice || undefined,
        note: "Assigned by customer from dashboard",
      });
      setMessage("Tasker assigned successfully. Task status changed to assigned.");
      await loadTasks();
      await loadApplicants(taskId);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to assign tasker.");
    } finally {
      setAssigningTaskId(null);
    }
  };

  const authorizePayment = async (taskId, amount, couponCode) => {
    setError("");
    setMessage("");
    setPayingTaskId(taskId);
    try {
      const res = await api.post(`/payments/tasks/${taskId}/authorize`, {
        task_amount: Number(amount),
        coupon_code: couponCode || null,
        currency: "USD",
      });
      setMessage(`Payment authorized. Payment ID: ${res?.data?.payment?.id}`);
      setPaymentAmountByTask((prev) => ({ ...prev, [taskId]: "" }));
      setCouponCodeByTask((prev) => ({ ...prev, [taskId]: "" }));
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Payment authorization failed.");
    } finally {
      setPayingTaskId(null);
    }
  };

  const capturePayment = async (paymentId) => {
    setError("");
    setMessage("");
    setCapturingPaymentId(paymentId);
    try {
      await api.post(`/payments/${paymentId}/capture`);
      setMessage("Payment captured successfully.");
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Payment capture failed.");
    } finally {
      setCapturingPaymentId(null);
    }
  };

  const approveActualCost = async (taskId) => {
    setError("");
    setMessage("");
    setApprovingActualCostTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/actual-cost/approve`);
      setMessage("Actual cost approved. You can capture after completion.");
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve actual cost.");
    } finally {
      setApprovingActualCostTaskId(null);
    }
  };

  const uploadCustomerPhotos = async (taskId) => {
    const files = customerPhotoFilesByTask[taskId] || [];
    if (!files.length) {
      setError("Please select at least one photo to upload.");
      return;
    }

    setError("");
    setMessage("");
    setUploadingCustomerPhotoTaskId(taskId);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos[]", file));
      await api.post(`/tasks/${taskId}/photos/customer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Task detail photos uploaded successfully.");
      setCustomerPhotoFilesByTask((prev) => ({ ...prev, [taskId]: [] }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload customer photos.");
    } finally {
      setUploadingCustomerPhotoTaskId(null);
    }
  };

  const getOtp = async (taskId, regenerate = false) => {
    setError("");
    setMessage("");
    setOtpTaskId(taskId);
    try {
      const endpoint = regenerate ? `/tasks/${taskId}/otp/regenerate` : `/tasks/${taskId}/otp`;
      const res = await api[regenerate ? "post" : "get"](endpoint);
      setOtpMap((prev) => ({
        ...prev,
        [taskId]: {
          otp: res.data.otp,
          expires_at: res.data.expires_at,
        },
      }));
      setMessage(regenerate ? "OTP regenerated." : "OTP loaded.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load OTP.");
    } finally {
      setOtpTaskId(null);
    }
  };

  const handlePayAfterService = async (taskId, amount, couponCode) => {
    setError("");
    setMessage("");
    setPayAfterTaskId(taskId);
    try {
      const res = await api.post(`/payments/tasks/${taskId}/pay-after-service`, {
        task_amount: Number(amount),
        coupon_code: couponCode || null,
        currency: "USD",
      });
      setMessage(`Pay-after-service done. Payment ID: ${res?.data?.payment?.id}`);
      setPaymentAmountByTask((prev) => ({ ...prev, [taskId]: "" }));
      setCouponCodeByTask((prev) => ({ ...prev, [taskId]: "" }));
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Pay-after-service failed.");
    } finally {
      setPayAfterTaskId(null);
    }
  };

  const confirmCompletion = async (taskId) => {
    setError("");
    setMessage("");
    setConfirmingCompletionTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/confirm-completion`, {
        note: "Customer confirmed completion from dashboard",
      });
      setMessage("Task completion confirmed. Status remains completed.");
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to confirm completion.");
    } finally {
      setConfirmingCompletionTaskId(null);
    }
  };

  const closeTask = async (taskId) => {
    setError("");
    setMessage("");
    setClosingTaskId(taskId);
    try {
      await api.post(`/tasks/${taskId}/close`, {
        note: "Closed by customer from dashboard",
      });
      setMessage("Task status changed to closed.");
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to close task.");
    } finally {
      setClosingTaskId(null);
    }
  };

  const getReviewDraft = (task) => {
    const existing = reviewDrafts[task.id];
    if (existing) {
      return existing;
    }
    return {
      rating: task.review?.rating ? String(task.review.rating) : "5",
      comment: task.review?.comment || "",
    };
  };

  const onReviewDraftChange = (taskId, key, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [key]: value,
      },
    }));
  };

  const submitReview = async (task) => {
    const draft = getReviewDraft(task);
    setError("");
    setMessage("");
    setReviewSubmittingTaskId(task.id);
    try {
      const payload = {
        rating: Number(draft.rating),
        comment: draft.comment || null,
      };

      if (task.review?.id) {
        await api.put(`/tasks/${task.id}/review`, payload);
        setMessage("Review updated successfully.");
      } else {
        await api.post(`/tasks/${task.id}/review`, payload);
        setMessage("Review submitted successfully.");
      }

      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || "Review action failed.");
    } finally {
      setReviewSubmittingTaskId(null);
    }
  };

  const getTaskPaymentAmount = (taskId) => paymentAmountByTask[taskId] || "";
  const getTaskCouponCode = (taskId) => couponCodeByTask[taskId] || "";
  const openCount = tasks.filter((t) => t.status === "open").length;
  const assignedCount = tasks.filter((t) => t.status === "assigned").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const closedCount = tasks.filter((t) => t.status === "closed").length;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore API logout failures and clear client state anyway.
    } finally {
      localStorage.removeItem("alpine_token");
      localStorage.removeItem("alpine_user");
      navigate("/login");
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf3ff_0%,#f7f9fe_100%)] py-8">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#1f2d6e]">Customer Dashboard</h1>
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
          <div className="rounded-xl bg-[linear-gradient(135deg,#2f65d5,#244ea8)] p-3 text-white shadow-sm"><p className="text-[11px] uppercase tracking-wide text-blue-100">Total</p><p className="text-2xl font-bold">{tasks.length}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Open</p><p className="text-2xl font-bold text-[#1f2d6e]">{openCount}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Assigned</p><p className="text-2xl font-bold text-[#1f2d6e]">{assignedCount}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">In Progress</p><p className="text-2xl font-bold text-[#1f2d6e]">{inProgressCount}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Completed</p><p className="text-2xl font-bold text-[#1f2d6e]">{completedCount}</p></div>
          <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"><p className="text-[11px] uppercase tracking-wide text-slate-500">Closed</p><p className="text-2xl font-bold text-[#1f2d6e]">{closedCount}</p></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-4 text-xl font-semibold text-[#1f2d6e]">Create Task</h2>
              <form className="space-y-3" onSubmit={handleCreateTask}>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Task title"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Task description"
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2"
                  required
                />
                <input
                  name="budget_estimate"
                  value={form.budget_estimate}
                  onChange={onChange}
                  type="number"
                  min="1"
                  placeholder="Budget"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3"
                  required
                />
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={onChange}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3"
                  required
                >
                  {categories.length === 0 ? <option value="">No categories available</option> : null}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={onChange}
                  type="datetime-local"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3"
                />
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Address"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3"
                  required
                />
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="City"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3"
                  required
                />

                <p className="text-xs text-slate-500">Task status is set to Open automatically on create.</p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 w-full rounded-full bg-[#2f87d6] text-sm font-semibold text-white hover:bg-[#2578c1] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Creating..." : "Create Task"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#1f2d6e]">My Tasks</h2>
                <button
                  type="button"
                  onClick={loadTasks}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>

              {loading ? <p className="text-sm text-slate-500">Loading tasks...</p> : null}
              {!loading && tasks.length === 0 ? <p className="text-sm text-slate-500">No tasks yet.</p> : null}

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1f2d6e]">{task.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                        {task.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Budget: ${task.budget_estimate}</span>
                      <span>City: {task.city}</span>
                      <span>Address: {task.address}</span>
                    </div>

                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-[#1f2d6e]">Task Detail Photos</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            setCustomerPhotoFilesByTask((prev) => ({
                              ...prev,
                              [task.id]: Array.from(e.target.files || []),
                            }))
                          }
                          className="max-w-full text-xs"
                        />
                        <button
                          type="button"
                          disabled={uploadingCustomerPhotoTaskId === task.id}
                          onClick={() => uploadCustomerPhotos(task.id)}
                          className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2877bf] disabled:opacity-70"
                        >
                          {uploadingCustomerPhotoTaskId === task.id ? "Uploading..." : "Upload Photos"}
                        </button>
                      </div>
                    </div>

                    {task.status === "open" ? (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-[#1f2d6e]">Tasker Applications</p>
                          <button
                            type="button"
                            onClick={() => loadApplicants(task.id)}
                            disabled={loadingApplicantsTaskId === task.id}
                            className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
                          >
                            {loadingApplicantsTaskId === task.id ? "Loading..." : "Load Applicants"}
                          </button>
                        </div>

                        {(applicantsByTask[task.id] || []).length === 0 ? (
                          <p className="mt-2 text-xs text-slate-500">No applicants loaded yet.</p>
                        ) : (
                          <div className="mt-2 space-y-2">
                            {applicantsByTask[task.id].map((app) => (
                              <div key={app.id} className="rounded border border-slate-200 bg-white px-3 py-2 text-xs">
                                <p className="font-semibold text-slate-800">
                                  {app.tasker?.name || `Tasker #${app.tasker_id}`} ({app.tasker?.email || "no-email"})
                                </p>
                                <p className="text-slate-600">
                                  Offer: ${app.offer_price || task.budget_estimate} | Status: {app.status}
                                </p>
                                {app.message ? <p className="text-slate-600">Message: {app.message}</p> : null}
                                <button
                                  type="button"
                                  disabled={assigningTaskId === task.id || app.status === "accepted"}
                                  onClick={() => assignTasker(task.id, app.tasker_id, app.offer_price)}
                                  className="mt-2 rounded-full bg-[#1e2756] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                                >
                                  {assigningTaskId === task.id ? "Assigning..." : "Assign Tasker"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {task.status === "assigned" ? (
                      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p className="text-xs font-semibold text-blue-900">Customer OTP</p>
                        <p className="mt-1 text-xs text-blue-800">
                          Share this OTP with tasker when they arrive.
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={otpTaskId === task.id}
                            onClick={() => getOtp(task.id, false)}
                            className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2877bf] disabled:opacity-70"
                          >
                            {otpTaskId === task.id ? "Loading..." : "Show OTP"}
                          </button>
                          <button
                            type="button"
                            disabled={otpTaskId === task.id}
                            onClick={() => getOtp(task.id, true)}
                            className="rounded-full border border-blue-300 px-4 py-2 text-xs font-semibold text-blue-900 hover:bg-blue-100 disabled:opacity-70"
                          >
                            Regenerate OTP
                          </button>
                          {otpMap[task.id]?.otp ? (
                            <span className="rounded-md bg-white px-3 py-2 text-sm font-bold tracking-[0.2em] text-[#1f2d6e]">
                              {otpMap[task.id].otp}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <input
                        type="number"
                        min="1"
                        placeholder="Pay amount"
                        value={getTaskPaymentAmount(task.id)}
                        onChange={(e) =>
                          setPaymentAmountByTask((prev) => ({ ...prev, [task.id]: e.target.value }))
                        }
                        className="h-10 rounded-lg border border-slate-200 px-3 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Coupon code (optional)"
                        value={getTaskCouponCode(task.id)}
                        onChange={(e) =>
                          setCouponCodeByTask((prev) => ({ ...prev, [task.id]: e.target.value.toUpperCase() }))
                        }
                        className="h-10 rounded-lg border border-slate-200 px-3 text-xs"
                      />
                      <button
                        type="button"
                        disabled={payingTaskId === task.id || !getTaskPaymentAmount(task.id)}
                        onClick={() =>
                          authorizePayment(task.id, getTaskPaymentAmount(task.id), getTaskCouponCode(task.id))
                        }
                        className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2877bf] disabled:opacity-70"
                      >
                        {payingTaskId === task.id ? "Holding..." : "Pay in Advance (Hold by Platform)"}
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      Pre-authorization hold is kept 20-50% above estimated task price due to possible on-site variations.
                    </p>

                    {task.payment?.id ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-600">
                          Payment #{task.payment.id} | Status: {task.payment.status === "authorized" ? "Held by Platform" : task.payment.status}
                        </span>
                        {task.payment?.payout ? (
                          <span className="text-xs text-slate-600">
                            | Payout: {task.payment.payout.status}
                            {task.payment.payout.scheduled_for
                              ? ` (Scheduled: ${new Date(task.payment.payout.scheduled_for).toLocaleString()})`
                              : ""}
                          </span>
                        ) : null}
                        {task.payment.status === "authorized" && (task.status === "completed" || task.status === "closed") ? (
                          <button
                            type="button"
                            disabled={capturingPaymentId === task.payment.id}
                            onClick={() => capturePayment(task.payment.id)}
                            className="rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                          >
                            {capturingPaymentId === task.payment.id ? "Capturing..." : "Capture Final Payment"}
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    {task.assignment?.actual_cost_submitted_at ? (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-900">Tasker Submitted Actual Cost</p>
                        <p className="mt-1 text-xs text-amber-800">
                          Amount: ${task.assignment.actual_cost || "-"}
                          {task.assignment.actual_cost_note ? ` | Note: ${task.assignment.actual_cost_note}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-amber-800">
                          Submitted: {new Date(task.assignment.actual_cost_submitted_at).toLocaleString()}
                        </p>
                        {task.assignment.actual_cost_approved_by_customer ? (
                          <p className="mt-2 text-xs font-semibold text-green-700">Approved by customer.</p>
                        ) : (
                          <button
                            type="button"
                            disabled={approvingActualCostTaskId === task.id}
                            onClick={() => approveActualCost(task.id)}
                            className="mt-2 rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2877bf] disabled:opacity-70"
                          >
                            {approvingActualCostTaskId === task.id ? "Approving..." : "Approve Actual Cost"}
                          </button>
                        )}
                      </div>
                    ) : null}

                    {(task.status === "completed" || task.status === "closed") ? (
                      <>
                        {task.status === "completed" ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={confirmingCompletionTaskId === task.id || !!task.assignment?.closed_at}
                              onClick={() => confirmCompletion(task.id)}
                              className="rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                            >
                              {confirmingCompletionTaskId === task.id
                                ? "Confirming..."
                                : task.assignment?.closed_at
                                  ? "Completion Confirmed"
                                  : "Confirm Completion"}
                            </button>
                            <button
                              type="button"
                              disabled={closingTaskId === task.id}
                              onClick={() => closeTask(task.id)}
                              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                            >
                              {closingTaskId === task.id ? "Closing..." : "Close Task"}
                            </button>
                          </div>
                        ) : null}

                        <button
                          type="button"
                          disabled={payAfterTaskId === task.id || !getTaskPaymentAmount(task.id)}
                          onClick={() =>
                            handlePayAfterService(task.id, getTaskPaymentAmount(task.id), getTaskCouponCode(task.id))
                          }
                          className="mt-3 rounded-full border border-[#2f87d6] px-4 py-2 text-xs font-semibold text-[#2f87d6] hover:bg-blue-50 disabled:opacity-70"
                        >
                          {payAfterTaskId === task.id ? "Processing..." : "Pay After Service"}
                        </button>

                        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs font-semibold text-[#1f2d6e]">
                            {task.review ? "Update your review" : "Rate this tasker"}
                          </p>
                          {task.review ? (
                            <p className="mt-1 text-xs text-slate-600">
                              Current: {task.review.rating}/5
                              {task.review.comment ? ` - ${task.review.comment}` : ""}
                            </p>
                          ) : null}
                          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <select
                              className="h-10 rounded-lg border border-slate-200 px-3 text-xs"
                              value={getReviewDraft(task).rating}
                              onChange={(e) => onReviewDraftChange(task.id, "rating", e.target.value)}
                            >
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Good</option>
                              <option value="3">3 - Average</option>
                              <option value="2">2 - Poor</option>
                              <option value="1">1 - Very Poor</option>
                            </select>
                            <input
                              type="text"
                              className="h-10 rounded-lg border border-slate-200 px-3 text-xs sm:col-span-2"
                              placeholder="Comment (optional)"
                              value={getReviewDraft(task).comment}
                              onChange={(e) => onReviewDraftChange(task.id, "comment", e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            disabled={reviewSubmittingTaskId === task.id}
                            onClick={() => submitReview(task)}
                            className="mt-2 rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                          >
                            {reviewSubmittingTaskId === task.id
                              ? "Saving..."
                              : task.review
                                ? "Update Review"
                                : "Submit Review"}
                          </button>
                        </div>
                      </>
                    ) : null}

                    {(task.status === "open" || task.status === "assigned") && (
                      <button
                        type="button"
                        onClick={() => handleCancelTask(task.id)}
                        className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Cancel Task
                      </button>
                    )}
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

export default CustomerTasksPage;
