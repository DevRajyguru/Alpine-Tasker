import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const initialForm = {
  task_id: "",
  against_user_id: "",
  subject: "",
  description: "",
  priority: "medium",
};

function DisputesPage() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [replyMap, setReplyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  const loadDisputes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/disputes");
      const rows = Array.isArray(res.data?.disputes?.data) ? res.data.disputes.data : [];
      setDisputes(rows);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load disputes.");
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
    loadDisputes();
  }, [navigate]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createDispute = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await api.post("/disputes", {
        ...form,
        task_id: Number(form.task_id),
        against_user_id: Number(form.against_user_id),
      });
      setForm(initialForm);
      setMessage("Dispute created.");
      await loadDisputes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create dispute.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendReply = async (disputeId) => {
    const text = (replyMap[disputeId] || "").trim();
    if (!text) return;
    setError("");
    setMessage("");
    try {
      await api.post(`/disputes/${disputeId}/messages`, { message: text });
      setReplyMap((prev) => ({ ...prev, [disputeId]: "" }));
      setMessage("Reply sent.");
      await loadDisputes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reply.");
    }
  };

  return (
    <main className="bg-[#f5f7fb] py-10">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h1 className="mb-4 text-2xl font-bold text-[#1f2d6e]">Raise Dispute</h1>
            <p className="mb-4 text-xs text-slate-500">
              Logged in as <span className="font-semibold">{user?.name || "User"}</span>
            </p>

            {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {message ? <p className="mb-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

            <form className="space-y-3" onSubmit={createDispute}>
              <input
                className="h-11 w-full rounded-lg border border-slate-200 px-3"
                name="task_id"
                type="number"
                min="1"
                placeholder="Task ID"
                value={form.task_id}
                onChange={onChange}
                required
              />
              <input
                className="h-11 w-full rounded-lg border border-slate-200 px-3"
                name="against_user_id"
                type="number"
                min="1"
                placeholder="Against User ID"
                value={form.against_user_id}
                onChange={onChange}
                required
              />
              <input
                className="h-11 w-full rounded-lg border border-slate-200 px-3"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={onChange}
                required
              />
              <textarea
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                name="description"
                placeholder="Describe issue"
                rows={4}
                value={form.description}
                onChange={onChange}
                required
              />
              <select
                name="priority"
                value={form.priority}
                onChange={onChange}
                className="h-11 w-full rounded-lg border border-slate-200 px-3"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-full bg-[#1e2756] text-sm font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
              >
                {submitting ? "Creating..." : "Create Dispute"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1f2d6e]">My Disputes</h2>
              <button
                type="button"
                onClick={loadDisputes}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Refresh
              </button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading disputes...</p> : null}
            {!loading && disputes.length === 0 ? <p className="text-sm text-slate-500">No disputes found.</p> : null}

            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1f2d6e]">{dispute.subject}</h3>
                      <p className="mt-1 text-sm text-slate-600">{dispute.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                      {dispute.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Task #{dispute.task_id} | Priority: {dispute.priority}</p>

                  <div className="mt-3 space-y-2 rounded-md bg-slate-50 p-3">
                    {(dispute.messages || []).map((msg) => (
                      <div key={msg.id} className="rounded border border-slate-200 bg-white px-3 py-2 text-sm">
                        {msg.message}
                      </div>
                    ))}
                    {(dispute.messages || []).length === 0 ? (
                      <p className="text-xs text-slate-500">No replies yet.</p>
                    ) : null}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyMap[dispute.id] || ""}
                      onChange={(e) => setReplyMap((prev) => ({ ...prev, [dispute.id]: e.target.value }))}
                      placeholder="Type a reply..."
                      className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => sendReply(dispute.id)}
                      className="rounded-full bg-[#2f87d6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2877bf]"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DisputesPage;
