import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= CONSTANTS ================= */

const COLORS = ["#6366f1", "#22c55e", "#f97316"];

export default function Reports() {
  const { t } = useTranslation();
  const { users } = useAuth();
  const { theme } = useTheme();

  // Determine if we are effectively in dark mode
  const isDarkMode =
    theme === 'dark' ||
    (theme === 'device' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const tooltipStyles = isDarkMode
    ? { backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }
    : { backgroundColor: "#fff", borderColor: "#e2e8f0", color: "#1e293b" };

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const auditLogs =
    JSON.parse(localStorage.getItem("ascendion_audit_logs")) || [];

  /* ================= DATA ================= */

  const rolesCount = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const roleChartData = Object.entries(rolesCount).map(
    ([role, count]) => ({
      name: role,
      value: count,
    })
  );

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter ? u.role === roleFilter : true;

    return matchSearch && matchRole;
  });

  /* ================= EXPORT ================= */

  const exportCSV = () => {
    const header = `${t('reports.name')},${t('reports.email')},${t('reports.role')},${t('reports.lastLogin')}\n`;
    const rows = users
      .map(
        (u) =>
          `${u.name || ""},${u.email},${u.role},${u.lastLogin || t('reports.never')}`
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users-report.csv";
    link.click();
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-12">

      {/* ================= SYSTEM SUMMARY ================= */}
      <section className="bg-white p-6 rounded-xl shadow dark:bg-slate-800 dark:border dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('reports.systemSummary')}</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <SummaryCard label={t('reports.totalUsers')} value={users.length} />
          <SummaryCard
            label={t('home.rolesSupported')}
            value={Object.keys(rolesCount).length}
          />
          <SummaryCard label={t('home.systemStatus')} value={t('home.operational')} />
        </div>
      </section>

      {/* ================= FILTERS ================= */}
      <section className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 dark:bg-slate-800 dark:border dark:border-slate-700">
        <input
          placeholder={t('reports.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        >
          <option value="">{t('reports.allRoles')}</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </section>

      {/* ================= USER ACTIVITY REPORT ================= */}
      <section className="bg-white p-6 rounded-xl shadow dark:bg-slate-800 dark:border dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {t('reports.userActivityReport')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border dark:border-slate-700">
            <thead className="bg-gray-100 dark:bg-slate-900 dark:text-gray-300">
              <tr>
                <th className="p-2 text-left">{t('reports.name')}</th>
                <th className="p-2 text-left">{t('reports.email')}</th>
                <th className="p-2 text-left">{t('reports.role')}</th>
                <th className="p-2 text-left">{t('reports.lastLogin')}</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-300">
              {filteredUsers.map((u) => (
                <tr key={u.id || u._id} className="border-t dark:border-slate-700">
                  <td className="p-2">{u.name || "-"}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.lastLogin || t('reports.never')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={exportCSV}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('reports.exportUsersCSV')}
        </button>
      </section>

      {/* ================= CHARTS ================= */}
      <section className="grid md:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow h-[320px] dark:bg-slate-800 dark:border dark:border-slate-700">
          <h3 className="font-semibold mb-4 dark:text-white">{t('reports.roleDistribution')}</h3>

          <ResponsiveContainer>
            <PieChart>
              <Pie data={roleChartData} dataKey="value" label>
                {roleChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyles} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow h-[320px] dark:bg-slate-800 dark:border dark:border-slate-700">
          <h3 className="font-semibold mb-4 dark:text-white">{t('reports.usersByRole')}</h3>

          <ResponsiveContainer>
            <BarChart data={roleChartData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }} contentStyle={tooltipStyles} />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ================= LOGIN AUDIT REPORT ================= */}
      <section className="bg-white p-6 rounded-xl shadow dark:bg-slate-800 dark:border dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {t('reports.loginAuditReport')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border dark:border-slate-700">
            <thead className="bg-gray-100 dark:bg-slate-900 dark:text-gray-300">
              <tr>
                <th className="p-2 text-left">{t('reports.email')}</th>
                <th className="p-2 text-left">{t('reports.status')}</th>
                <th className="p-2 text-left">{t('reports.time')}</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-300">
              {auditLogs.map((log, index) => (
                <tr key={index} className="border-t dark:border-slate-700">
                  <td className="p-2">{log.email}</td>
                  <td
                    className={`p-2 ${log.success
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {log.success ? t('reports.success') : t('reports.failed')}
                  </td>
                  <td className="p-2">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const SummaryCard = ({ label, value }) => (
  <div className="border rounded p-4 text-center dark:border-slate-700">
    <p className="text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold mt-2 dark:text-white">{value}</p>
  </div>
);
