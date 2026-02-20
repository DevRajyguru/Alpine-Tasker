import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function CustomerDynamicTaskPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({
    category_id: "1",
    title: "",
    description: "",
    budget_estimate: "",
    scheduled_at: "",
    address: "",
    city: "",
  });
  const [dynamicFields, setDynamicFields] = useState({});
  const [dynamicFiles, setDynamicFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState([]);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (user?.role !== "customer") {
      setError("Only customer can use this page.");
      return;
    }
    (async () => {
      try {
        const res = await api.get("/services");
        setServices(Array.isArray(res.data?.services) ? res.data.services : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load services.");
      }
    })();
  }, [navigate, user?.role]);

  const loadServiceSchema = async (serviceId) => {
    setSelectedServiceId(serviceId);
    setSelectedService(null);
    setDynamicFields({});
    setDynamicFiles({});
    if (!serviceId) return;
    try {
      const res = await api.get(`/services/${serviceId}`);
      setSelectedService(res.data?.service || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load service schema.");
    }
  };

  const submitTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("category_id", form.category_id);
      fd.append("service_id", selectedServiceId);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("budget_estimate", form.budget_estimate);
      fd.append("scheduled_at", form.scheduled_at);
      fd.append("address", form.address);
      fd.append("city", form.city);

      Object.entries(dynamicFields).forEach(([key, value]) => {
        fd.append(`dynamic_fields[${key}]`, value);
      });
      Object.entries(dynamicFiles).forEach(([key, file]) => {
        if (file) fd.append(`dynamic_files[${key}]`, file);
      });

      const res = await api.post("/tasks", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setWarnings(Array.isArray(res.data?.warnings) ? res.data.warnings : []);
      setMessage("Task submitted with dynamic fields.");
      setForm({
        category_id: "1",
        title: "",
        description: "",
        budget_estimate: "",
        scheduled_at: "",
        address: "",
        city: "",
      });
      setDynamicFields({});
      setDynamicFiles({});
    } catch (err) {
      setError(err?.response?.data?.message || "Task submit failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderDynamicInput = (field) => {
    const key = field.key;
    if (field.type === "dropdown") {
      return (
        <select
          className="h-10 w-full rounded border border-slate-200 px-3 text-sm"
          value={dynamicFields[key] || ""}
          onChange={(e) => setDynamicFields((p) => ({ ...p, [key]: e.target.value }))}
          required={field.is_required}
        >
          <option value="">Select option</option>
          {(field.options || []).map((opt) => (
            <option key={opt.id} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    if (field.type === "checkbox") {
      return (
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={!!dynamicFields[key]}
            onChange={(e) => setDynamicFields((p) => ({ ...p, [key]: e.target.checked ? "1" : "0" }))}
          />
          Yes
        </label>
      );
    }
    if (field.type === "date_time_picker") {
      return (
        <input
          type="datetime-local"
          className="h-10 w-full rounded border border-slate-200 px-3 text-sm"
          value={dynamicFields[key] || ""}
          onChange={(e) => setDynamicFields((p) => ({ ...p, [key]: e.target.value }))}
          required={field.is_required}
        />
      );
    }
    if (field.type === "image_upload") {
      return (
        <input
          type="file"
          accept="image/*,.pdf"
          className="h-10 w-full rounded border border-slate-200 px-2 text-sm"
          onChange={(e) => setDynamicFiles((p) => ({ ...p, [key]: e.target.files?.[0] || null }))}
          required={field.is_required}
        />
      );
    }
    const isNumber = ["number_input", "duration_selector", "weight_selector", "quantity_selector"].includes(field.type);
    return (
      <input
        type={isNumber ? "number" : "text"}
        className="h-10 w-full rounded border border-slate-200 px-3 text-sm"
        placeholder={field.placeholder || ""}
        value={dynamicFields[key] || ""}
        onChange={(e) => setDynamicFields((p) => ({ ...p, [key]: e.target.value }))}
        required={field.is_required}
      />
    );
  };

  const serviceDisclaimers = [];
  if (selectedService?.license_not_required) {
    serviceDisclaimers.push("License not required for this service.");
  }
  if (selectedService?.skill_not_required) {
    serviceDisclaimers.push("Special skill not required for this service.");
  }
  if (selectedService?.hazardous_work_not_allowed) {
    serviceDisclaimers.push("Hazardous work is not allowed.");
  }
  if (selectedService?.no_medical_childcare_electrical_work) {
    serviceDisclaimers.push("No medical, childcare, or electrical work is allowed.");
  }

  return (
    <main className="bg-[#f5f7fb] py-10">
      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <h1 className="text-2xl font-bold text-[#1f2d6e]">Dynamic Task Form</h1>
          <p className="mt-1 text-xs text-slate-500">Select service and fill custom requirements.</p>
          {error ? <p className="mt-3 rounded bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p> : null}
          {message ? <p className="mt-3 rounded bg-green-50 px-3 py-2 text-xs text-green-700">{message}</p> : null}
          {warnings.length > 0 ? (
            <div className="mt-3 rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <p className="font-semibold">Warnings:</p>
              <ul className="mt-1 list-disc pl-5">
                {warnings.map((warning, idx) => (
                  <li key={`${warning.field_key}-${idx}`}>{warning.message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4">
            <select
              className="h-10 w-full rounded border border-slate-200 px-3 text-sm"
              value={selectedServiceId}
              onChange={(e) => loadServiceSchema(e.target.value)}
            >
              <option value="">Select service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          {selectedService ? (
            <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-900">Safety Rules & Disclaimers</p>
              {serviceDisclaimers.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-900">
                  {serviceDisclaimers.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-amber-900">No additional service disclaimers configured.</p>
              )}
              {selectedService.custom_warning_message ? (
                <p className="mt-2 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                  {selectedService.custom_warning_message}
                </p>
              ) : null}
            </div>
          ) : null}

          <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={submitTask}>
            <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Category ID" value={form.category_id} onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))} required />
            <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            <textarea className="rounded border border-slate-200 px-3 py-2 text-sm md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
            <input className="h-10 rounded border border-slate-200 px-3 text-sm" type="number" min="1" placeholder="Budget estimate" value={form.budget_estimate} onChange={(e) => setForm((p) => ({ ...p, budget_estimate: e.target.value }))} required />
            <input className="h-10 rounded border border-slate-200 px-3 text-sm" type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm((p) => ({ ...p, scheduled_at: e.target.value }))} />
            <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
            <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} required />

            {selectedService?.fields?.length ? (
              <div className="md:col-span-2 mt-2 rounded border border-slate-200 p-3">
                <h2 className="mb-3 text-sm font-semibold text-[#1f2d6e]">Custom Requirements</h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {selectedService.fields.map((field) => (
                    <div key={field.id}>
                      <p className="mb-1 text-xs font-semibold text-slate-700">
                        {field.label}{field.is_required ? " *" : ""}
                      </p>
                      {renderDynamicInput(field)}
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                        {field.help_text ? <span>{field.help_text}</span> : null}
                        {field.min_value !== null ? <span>Min: {field.min_value}</span> : null}
                        {field.max_value !== null ? <span>Max: {field.max_value}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <button disabled={submitting || !selectedServiceId} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white md:col-span-2">
              {submitting ? "Submitting..." : "Submit Dynamic Task"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CustomerDynamicTaskPage;
