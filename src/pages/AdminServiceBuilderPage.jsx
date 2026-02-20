import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

const fieldTypes = [
  "text_input",
  "number_input",
  "dropdown",
  "checkbox",
  "location_picker",
  "date_time_picker",
  "duration_selector",
  "image_upload",
  "weight_selector",
  "quantity_selector",
];

const initialServiceForm = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  license_not_required: false,
  skill_not_required: false,
  hazardous_work_not_allowed: true,
  no_medical_childcare_electrical_work: true,
  custom_warning_message: "",
};

const initialFieldForm = {
  label: "",
  key: "",
  type: "text_input",
  is_required: false,
  min_value: "",
  max_value: "",
  placeholder: "",
  help_text: "",
  visibility_customer: true,
  visibility_tasker: true,
  visibility_admin: true,
  cond_depends_on: "",
  cond_operator: ">",
  cond_value: "",
  warning_message: "",
  optionsText: "",
};

function AdminServiceBuilderPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [fields, setFields] = useState([]);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [fieldForm, setFieldForm] = useState(initialFieldForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const loadServices = useCallback(async () => {
    try {
      const res = await api.get("/admin/services");
      const rows = Array.isArray(res.data?.services?.data) ? res.data.services.data : [];
      setServices(rows);
      if (!selectedServiceId && rows.length > 0) {
        setSelectedServiceId(rows[0].id);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load services.");
    }
  }, [selectedServiceId]);

  const loadFields = useCallback(async (serviceId) => {
    if (!serviceId) return;
    try {
      const res = await api.get(`/admin/services/${serviceId}/fields`);
      setFields(Array.isArray(res.data?.fields) ? res.data.fields : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load service fields.");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    if (user?.role !== "admin") {
      setError("Only admin can access service builder.");
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      await loadServices();
      setLoading(false);
    })();
  }, [loadServices, navigate, user?.role]);

  useEffect(() => {
    loadFields(selectedServiceId);
  }, [loadFields, selectedServiceId]);

  const createService = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await api.post("/admin/services", serviceForm);
      setServiceForm(initialServiceForm);
      setMessage("Service created.");
      await loadServices();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create service.");
    } finally {
      setSaving(false);
    }
  };

  const createField = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const options =
        fieldForm.type === "dropdown"
          ? fieldForm.optionsText
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
              .map((v, i) => ({ label: v, value: v, sort_order: i + 1 }))
          : [];

      const visibility_json = [
        fieldForm.visibility_customer ? "customer" : null,
        fieldForm.visibility_tasker ? "tasker" : null,
        fieldForm.visibility_admin ? "admin" : null,
      ].filter(Boolean);

      const conditional_json =
        fieldForm.cond_depends_on.trim() && fieldForm.cond_value !== ""
          ? {
              depends_on: fieldForm.cond_depends_on.trim(),
              operator: fieldForm.cond_operator,
              value: fieldForm.cond_value,
            }
          : null;

      await api.post(`/admin/services/${selectedServiceId}/fields`, {
        label: fieldForm.label,
        key: fieldForm.key,
        type: fieldForm.type,
        is_required: fieldForm.is_required,
        min_value: fieldForm.min_value !== "" ? Number(fieldForm.min_value) : null,
        max_value: fieldForm.max_value !== "" ? Number(fieldForm.max_value) : null,
        placeholder: fieldForm.placeholder || null,
        help_text: fieldForm.help_text || null,
        visibility_json,
        conditional_json,
        warning_message: fieldForm.warning_message || null,
        options,
      });
      setFieldForm(initialFieldForm);
      setMessage("Field created.");
      await loadFields(selectedServiceId);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create field.");
    } finally {
      setSaving(false);
    }
  };

  const deleteField = async (fieldId) => {
    if (!selectedServiceId) return;
    setError("");
    setMessage("");
    try {
      await api.delete(`/admin/services/${selectedServiceId}/fields/${fieldId}`);
      setMessage("Field deleted.");
      await loadFields(selectedServiceId);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete field.");
    }
  };

  const moveField = async (index, direction) => {
    if (!selectedServiceId) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= fields.length) return;
    const reordered = [...fields];
    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;
    const ids = reordered.map((f) => f.id);
    setFields(reordered);
    try {
      await api.post(`/admin/services/${selectedServiceId}/fields/reorder`, { field_ids: ids });
    } catch (err) {
      setError(err?.response?.data?.message || "Reorder failed.");
      await loadFields(selectedServiceId);
    }
  };

  const createDemoData = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const demoSlug = `demo-service-${Date.now()}`;
      const serviceRes = await api.post("/admin/services", {
        name: "Demo Moving Service",
        slug: demoSlug,
        description: "Auto-generated demo service for quick testing.",
        is_active: true,
      });

      const serviceId = serviceRes?.data?.service?.id;
      if (!serviceId) {
        throw new Error("Service creation failed.");
      }

      await api.post(`/admin/services/${serviceId}/fields`, {
        label: "Weight (kg)",
        key: "weight",
        type: "weight_selector",
        is_required: true,
        min_value: 1,
        max_value: 100,
        help_text: "Enter expected total weight in kilograms.",
        visibility_json: ["customer", "tasker", "admin"],
      });

      await api.post(`/admin/services/${serviceId}/fields`, {
        label: "Item Type",
        key: "item_type",
        type: "dropdown",
        is_required: true,
        options: [
          { label: "Boxes", value: "boxes", sort_order: 1 },
          { label: "Furniture", value: "furniture", sort_order: 2 },
          { label: "Appliances", value: "appliances", sort_order: 3 },
        ],
        visibility_json: ["customer", "tasker", "admin"],
      });

      await api.post(`/admin/services/${serviceId}/fields`, {
        label: "Stairs Involved",
        key: "stairs_involved",
        type: "checkbox",
        is_required: false,
        help_text: "Check if stairs are involved at pickup or drop-off.",
        visibility_json: ["customer", "tasker", "admin"],
      });

      await api.post(`/admin/services/${serviceId}/fields`, {
        label: "Heavy Load Warning",
        key: "heavy_load_warning",
        type: "text_input",
        is_required: false,
        help_text: "System warning field (hidden from customer if needed).",
        visibility_json: ["admin", "tasker"],
        conditional_json: {
          depends_on: "weight",
          operator: ">",
          value: 25,
        },
        warning_message: "Weight exceeds 25kg. Extra handling may be required.",
      });

      await loadServices();
      setSelectedServiceId(serviceId);
      await loadFields(serviceId);
      setMessage("Demo service and fields created.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create demo data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminPageLoader label="Loading service builder..." />;
  }

  return (
    <main className="bg-[#f5f7fb] py-10">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h1 className="text-2xl font-bold text-[#1f2d6e]">Service Builder</h1>
            <p className="mt-1 text-xs text-slate-500">Create services and dynamic fields.</p>
            {error ? <p className="mt-3 rounded bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p> : null}
            {message ? <p className="mt-3 rounded bg-green-50 px-3 py-2 text-xs text-green-700">{message}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={createDemoData}
                className="h-9 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
              >
                {saving ? "Processing..." : "Create Demo Service Data"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 text-lg font-semibold text-[#1f2d6e]">Create Service</h2>
            <form className="space-y-3" onSubmit={createService}>
              <input className="h-10 w-full rounded border border-slate-200 px-3 text-sm" placeholder="Name" value={serviceForm.name} onChange={(e) => setServiceForm((p) => ({ ...p, name: e.target.value }))} required />
              <input className="h-10 w-full rounded border border-slate-200 px-3 text-sm" placeholder="Slug" value={serviceForm.slug} onChange={(e) => setServiceForm((p) => ({ ...p, slug: e.target.value }))} required />
              <textarea className="w-full rounded border border-slate-200 px-3 py-2 text-sm" rows={3} placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm((p) => ({ ...p, description: e.target.value }))} />
              <div className="rounded border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-700">Safety Rules & Disclaimers</p>
                <div className="grid gap-2 text-xs text-slate-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={serviceForm.license_not_required} onChange={(e) => setServiceForm((p) => ({ ...p, license_not_required: e.target.checked }))} />
                    License not required
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={serviceForm.skill_not_required} onChange={(e) => setServiceForm((p) => ({ ...p, skill_not_required: e.target.checked }))} />
                    Skill not required
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={serviceForm.hazardous_work_not_allowed} onChange={(e) => setServiceForm((p) => ({ ...p, hazardous_work_not_allowed: e.target.checked }))} />
                    Hazardous work not allowed
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={serviceForm.no_medical_childcare_electrical_work} onChange={(e) => setServiceForm((p) => ({ ...p, no_medical_childcare_electrical_work: e.target.checked }))} />
                    No medical / childcare / electrical work
                  </label>
                  <input
                    className="h-10 w-full rounded border border-slate-200 px-3 text-sm"
                    placeholder="Custom warning message (shown during booking)"
                    value={serviceForm.custom_warning_message}
                    onChange={(e) => setServiceForm((p) => ({ ...p, custom_warning_message: e.target.value }))}
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={serviceForm.is_active} onChange={(e) => setServiceForm((p) => ({ ...p, is_active: e.target.checked }))} />
                Active
              </label>
              <button disabled={saving} className="h-10 w-full rounded-full bg-[#1e2756] text-xs font-semibold text-white">{saving ? "Saving..." : "Create Service"}</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#1f2d6e]">Services</h2>
              <select
                className="h-10 min-w-[220px] rounded border border-slate-200 px-3 text-sm"
                value={selectedServiceId || ""}
                onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              >
                <option value="" disabled>Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.fields_count} fields)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 text-lg font-semibold text-[#1f2d6e]">Add Field</h2>
            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={createField}>
              <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Label" value={fieldForm.label} onChange={(e) => setFieldForm((p) => ({ ...p, label: e.target.value }))} required />
              <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Key (ex: item_type)" value={fieldForm.key} onChange={(e) => setFieldForm((p) => ({ ...p, key: e.target.value }))} required />
              <select className="h-10 rounded border border-slate-200 px-3 text-sm" value={fieldForm.type} onChange={(e) => setFieldForm((p) => ({ ...p, type: e.target.value }))}>
                {fieldTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Placeholder" value={fieldForm.placeholder} onChange={(e) => setFieldForm((p) => ({ ...p, placeholder: e.target.value }))} />
              <input className="h-10 rounded border border-slate-200 px-3 text-sm" type="number" placeholder="Min value" value={fieldForm.min_value} onChange={(e) => setFieldForm((p) => ({ ...p, min_value: e.target.value }))} />
              <input className="h-10 rounded border border-slate-200 px-3 text-sm" type="number" placeholder="Max value" value={fieldForm.max_value} onChange={(e) => setFieldForm((p) => ({ ...p, max_value: e.target.value }))} />
              <input className="h-10 rounded border border-slate-200 px-3 text-sm md:col-span-2" placeholder="Help text" value={fieldForm.help_text} onChange={(e) => setFieldForm((p) => ({ ...p, help_text: e.target.value }))} />
              <div className="md:col-span-2 rounded border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-700">Visibility</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={fieldForm.visibility_customer} onChange={(e) => setFieldForm((p) => ({ ...p, visibility_customer: e.target.checked }))} />
                    Customer
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={fieldForm.visibility_tasker} onChange={(e) => setFieldForm((p) => ({ ...p, visibility_tasker: e.target.checked }))} />
                    Tasker
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={fieldForm.visibility_admin} onChange={(e) => setFieldForm((p) => ({ ...p, visibility_admin: e.target.checked }))} />
                    Admin
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 rounded border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-700">Conditional Logic</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                  <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Depends on key" value={fieldForm.cond_depends_on} onChange={(e) => setFieldForm((p) => ({ ...p, cond_depends_on: e.target.value }))} />
                  <select className="h-10 rounded border border-slate-200 px-3 text-sm" value={fieldForm.cond_operator} onChange={(e) => setFieldForm((p) => ({ ...p, cond_operator: e.target.value }))}>
                    <option value=">">{">"}</option>
                    <option value="<">{"<"}</option>
                    <option value=">=">{">="}</option>
                    <option value="<=">{"<="}</option>
                    <option value="==">{"=="}</option>
                    <option value="!=">{"!="}</option>
                  </select>
                  <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Condition value" value={fieldForm.cond_value} onChange={(e) => setFieldForm((p) => ({ ...p, cond_value: e.target.value }))} />
                  <input className="h-10 rounded border border-slate-200 px-3 text-sm" placeholder="Warning message" value={fieldForm.warning_message} onChange={(e) => setFieldForm((p) => ({ ...p, warning_message: e.target.value }))} />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Example: depends_on=`weight`, operator=`&gt;`, value=`25`, warning=`Heavy load extra care required`</p>
              </div>
              {fieldForm.type === "dropdown" ? (
                <input className="h-10 rounded border border-slate-200 px-3 text-sm md:col-span-2" placeholder="Dropdown options (comma separated)" value={fieldForm.optionsText} onChange={(e) => setFieldForm((p) => ({ ...p, optionsText: e.target.value }))} />
              ) : null}
              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={fieldForm.is_required} onChange={(e) => setFieldForm((p) => ({ ...p, is_required: e.target.checked }))} />
                Required field
              </label>
              <button disabled={saving || !selectedServiceId} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white hover:bg-[#1a214b] md:justify-self-end">{saving ? "Saving..." : "Add Field"}</button>
            </form>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 text-lg font-semibold text-[#1f2d6e]">Fields</h2>
            {fields.length === 0 ? <p className="text-sm text-slate-500">No fields yet.</p> : null}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-[#1f2d6e]">{field.label} <span className="text-xs text-slate-500">({field.key})</span></p>
                    <p className="text-xs text-slate-500">{field.type}{field.is_required ? " - required" : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveField(index, -1)} className="rounded border px-2 py-1 text-xs">Up</button>
                    <button type="button" onClick={() => moveField(index, 1)} className="rounded border px-2 py-1 text-xs">Down</button>
                    <button type="button" onClick={() => deleteField(field.id)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">Delete</button>
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

export default AdminServiceBuilderPage;


