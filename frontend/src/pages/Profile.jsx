import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const { user, users, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    officeLocation: "",
  });
  const [otherLocation, setOtherLocation] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const locations = ["Hyderabad", "Bangalore", "Pune", "Gurugram", "Chennai", "Mumbai"];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        designation: user.designation || "",
        officeLocation: user.officeLocation || "",
      });
      if (user.officeLocation && !locations.includes(user.officeLocation)) {
        setIsOtherSelected(true);
        setOtherLocation(user.officeLocation);
      }
      setPreviewUrl(user.profilePic || null);
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMsg("");
    if (!isEditing && user) {
      setPreviewUrl(user.profilePic || null);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsOtherSelected(true);
      setFormData({ ...formData, officeLocation: "" });
    } else {
      setIsOtherSelected(false);
      setFormData({ ...formData, officeLocation: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("officeLocation", isOtherSelected ? otherLocation : formData.officeLocation);
    if (selectedFile) {
      data.append("profilePic", selectedFile);
    }

    const result = await updateProfile(data);
    if (result.success) {
      setMsg("✅ Profile updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setMsg("");
      }, 2000);
    } else {
      setMsg(`❌ ${result.message}`);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500">
        {t('profile.noActiveSession')}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('profile.myProfile')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('profile.profileDesc')}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEditToggle}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition shadow-md"
          >
            {t('profile.editProfile')}
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden dark:bg-slate-800 dark:border dark:border-slate-700 transition-colors duration-200">
        <div className="p-8 grid md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-8 dark:border-slate-700">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-inner mb-4 border-4 border-white dark:border-slate-700">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.email[0].toUpperCase()
                )}
              </div>

              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
              {user.name || "User"}
            </h2>

            <span
              className={`mt-2 px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm ${user.role === "Admin"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                }`}
            >
              {user.role}
            </span>

            {user.lastLogin && (
              <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                {t('reports.lastLogin')}: {user.lastLogin}
              </p>
            )}
          </div>

          {/* Info Section */}
          <div className="md:col-span-2">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.fullName')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.designation')}</label>
                    <input
                      type="text"
                      placeholder="e.g. Associate Engineer - Engineering"
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.officeLocation')}</label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      value={isOtherSelected ? "Other" : formData.officeLocation}
                      onChange={handleLocationChange}
                    >
                      <option value="">{t('profile.selectLocation')}</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                      <option value="Other">Other...</option>
                    </select>
                  </div>
                  {isOtherSelected && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('profile.specifyLocation')}</label>
                      <input
                        type="text"
                        placeholder={t('profile.typeLocation')}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        value={otherLocation}
                        onChange={(e) => setOtherLocation(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                {msg && (
                  <p className={`text-sm font-medium ${msg.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
                    {msg}
                  </p>
                )}

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg transition shadow-md"
                  >
                    {t('profile.saveChanges')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoItem label={t('profile.emailAddress')} value={user.email} />
                  <InfoItem label={t('reports.role')} value={user.role} />
                  <InfoItem
                    label={t('profile.designation')}
                    value={user.designation || <span className="text-gray-400 italic">{t('profile.notSet')}</span>}
                  />
                  <InfoItem
                    label={t('profile.officeLocation')}
                    value={user.officeLocation || <span className="text-gray-400 italic">{t('profile.notSet')}</span>}
                  />
                </div>

                {/* Admin Stats */}
                {user.role === "Admin" && (
                  <div className="mt-8 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 dark:text-indigo-400">{t('profile.adminOverview')}</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {t('profile.adminManageDesc', { count: users.length })}
                    </p>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="pt-8 border-t dark:border-slate-700 flex justify-end">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition dark:hover:bg-red-900/10"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    {t('profile.logoutSession')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Info Item */
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-gray-800 font-medium dark:text-gray-200">{value}</p>
    </div>
  );
}
