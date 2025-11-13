import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    storeName: "",
    storeLogo: "",
    defaultLanguage: "en",
    currency: "EGP",
    supportEmail: "",
    allowUserRegistration: true,
    emailVerification: true,
    seoTitle: "",
    seoDescription: "",
    googleAnalyticsId: "",
    notifications: {
      email: true,
      push: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSettings();
      if (res.data) setSettings(res.data);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("notifications.")) {
      const key = name.split(".")[1];
      setSettings((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: checked },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminAPI.updateSettings(settings);
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-12">{t("loading") || "Loading..."}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">{t("settings") || "Settings"}</h1>

      {/* Store Info */}
      <div className="space-y-2">
        <h2 className="font-semibold">Store Info</h2>
        <input
          type="text"
          name="storeName"
          value={settings.storeName}
          onChange={handleChange}
          placeholder="Store Name"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="storeLogo"
          value={settings.storeLogo}
          onChange={handleChange}
          placeholder="Logo URL"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="supportEmail"
          value={settings.supportEmail}
          onChange={handleChange}
          placeholder="Support Email"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="defaultLanguage"
          value={settings.defaultLanguage}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
        <input
          type="text"
          name="currency"
          value={settings.currency}
          onChange={handleChange}
          placeholder="Currency"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Settings */}
      <div className="space-y-2">
        <h2 className="font-semibold">User Settings</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowUserRegistration"
            checked={settings.allowUserRegistration}
            onChange={handleChange}
          />
          Allow User Registration
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="emailVerification"
            checked={settings.emailVerification}
            onChange={handleChange}
          />
          Email Verification
        </label>
      </div>

      {/* SEO & Analytics */}
      <div className="space-y-2">
        <h2 className="font-semibold">SEO & Analytics</h2>
        <input
          type="text"
          name="seoTitle"
          value={settings.seoTitle}
          onChange={handleChange}
          placeholder="SEO Title"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="seoDescription"
          value={settings.seoDescription}
          onChange={handleChange}
          placeholder="SEO Description"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="googleAnalyticsId"
          value={settings.googleAnalyticsId}
          onChange={handleChange}
          placeholder="Google Analytics ID"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        <h2 className="font-semibold">Notifications</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="notifications.email"
            checked={settings.notifications.email}
            onChange={handleChange}
          />
          Email Notifications
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="notifications.push"
            checked={settings.notifications.push}
            onChange={handleChange}
          />
          Push Notifications
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
