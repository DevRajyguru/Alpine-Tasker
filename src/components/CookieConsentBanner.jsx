import { useEffect, useState } from "react";
import { api } from "../lib/api";

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("alpine_cookie_consented");
    if (accepted !== "1") {
      setVisible(true);
    }
  }, []);

  const getGuestToken = () => {
    const existing = localStorage.getItem("alpine_guest_token");
    if (existing) return existing;
    const created = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("alpine_guest_token", created);
    return created;
  };

  const submitConsent = async (analytics, marketing) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("alpine_token");
      await api.post("/auth/cookie-consents", {
        policy_version: "1.0",
        analytics,
        marketing,
        guest_token: token ? null : getGuestToken(),
      });
      localStorage.setItem("alpine_cookie_consented", "1");
      setVisible(false);
    } catch {
      // Keep banner visible on failure.
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_20px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          We use cookies to run essential features and improve experience. Please set your preferences.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => submitConsent(false, false)}
            disabled={saving}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
          >
            Necessary Only
          </button>
          <button
            type="button"
            onClick={() => submitConsent(true, true)}
            disabled={saving}
            className="rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
          >
            {saving ? "Saving..." : "Accept All"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
