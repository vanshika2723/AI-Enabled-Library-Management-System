import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Library,
  Bell,
  ShieldCheck,
  Save,
  Mail,
  Phone,
  MapPin,
  Lock,
  Clock,
  Globe,
  Check,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    libraryName: "SmartLib AI Library",
    email: "admin@smartlib.com",
    phone: "+91 98765 43210",
    address: "Library Campus, India",
    openingTime: "09:00",
    closingTime: "18:00",
    language: "English",
    emailNotifications: true,
    overdueAlerts: true,
    borrowNotifications: true,
    darkMode: false,
    twoFactor: false,
  });

  const tabs = [
    { name: "General", icon: SettingsIcon },
    { name: "Profile", icon: User },
    { name: "Library", icon: Library },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: ShieldCheck },
  ];

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("smartlib_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50";

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  const SectionHeading = ({ title, description }) => (
    <div className="mb-5">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );

  const Field = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account and library preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          {saved ? <Check size={17} /> : <Save size={17} />}
          {saved ? "Saved Successfully" : "Save Changes"}
        </button>
      </div>

      {/* Settings layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr]">
        {/* Tabs */}
        <div className="h-fit rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <div className="mb-3 px-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preferences
            </p>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    selected
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {/* General */}
          {activeTab === "General" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading
                title="General Preferences"
                description="Customize your application experience."
              />

              <div className="space-y-5">
                <Field label="Application Language" icon={Globe}>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting("language", e.target.value)}
                    className={`${inputClass} pl-10`}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </Field>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Dark Mode</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Enable dark appearance for the application.
                    </p>
                  </div>
                  <Toggle
                    checked={settings.darkMode}
                    onChange={(value) => updateSetting("darkMode", value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === "Profile" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading
                title="Admin Profile"
                description="Manage administrator contact information."
              />

              <div className="space-y-5">
                <Field label="Administrator Name" icon={User}>
                  <input
                    defaultValue="Library Administrator"
                    className={`${inputClass} pl-10`}
                  />
                </Field>

                <Field label="Email Address" icon={Mail}>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </Field>

                <Field label="Phone Number" icon={Phone}>
                  <input
                    value={settings.phone}
                    onChange={(e) => updateSetting("phone", e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Library */}
          {activeTab === "Library" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading
                title="Library Information"
                description="Update your library details and working hours."
              />

              <div className="space-y-5">
                <Field label="Library Name" icon={Library}>
                  <input
                    value={settings.libraryName}
                    onChange={(e) => updateSetting("libraryName", e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </Field>

                <Field label="Library Address" icon={MapPin}>
                  <input
                    value={settings.address}
                    onChange={(e) => updateSetting("address", e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Opening Time" icon={Clock}>
                    <input
                      type="time"
                      value={settings.openingTime}
                      onChange={(e) => updateSetting("openingTime", e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </Field>

                  <Field label="Closing Time" icon={Clock}>
                    <input
                      type="time"
                      value={settings.closingTime}
                      onChange={(e) => updateSetting("closingTime", e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "Notifications" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading
                title="Notification Preferences"
                description="Choose which notifications you want to receive."
              />

              <div className="divide-y divide-slate-100">
                {[
                  {
                    key: "emailNotifications",
                    title: "Email Notifications",
                    description: "Receive important library updates via email.",
                  },
                  {
                    key: "overdueAlerts",
                    title: "Overdue Book Alerts",
                    description: "Get notified when books pass their due date.",
                  },
                  {
                    key: "borrowNotifications",
                    title: "Borrowing Notifications",
                    description: "Notifications for book issues and returns.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 py-5"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.description}
                      </p>
                    </div>
                    <Toggle
                      checked={settings[item.key]}
                      onChange={(value) => updateSetting(item.key, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "Security" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading
                title="Security Settings"
                description="Manage account security preferences."
              />

              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Two-Factor Authentication
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Add an additional layer of account protection.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    checked={settings.twoFactor}
                    onChange={(value) => updateSetting("twoFactor", value)}
                  />
                </div>

                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Change Password
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Password updates will be connected to authentication API.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Change password feature will be connected later.")}
                    className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Footer */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-400">
              Settings are currently saved locally in this browser.
            </p>
            <button
              onClick={handleSave}
              className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}