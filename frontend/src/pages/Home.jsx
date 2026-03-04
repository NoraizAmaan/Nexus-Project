import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import imgA from "../assets/ai-reco-a.jpg";
import imgB from "../assets/ai-reco-b.jpg";
import imgC from "../assets/ai-reco-c.jpg";

/* ================= ICONS (INLINE SVGs) ================= */

const UserManagementIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M23 21v-2a4 4 0 0 0-3-3.87"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M16 3.13a4 4 0 0 1 0 7.75"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M5.5 21a6.5 6.5 0 0 1 13 0"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const ReportsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
    <path
      d="M3 3v18h18"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <rect
      x="7"
      y="10"
      width="3"
      height="7"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="12"
      y="6"
      width="3"
      height="11"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="17"
      y="13"
      width="3"
      height="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const ProjectIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
    <path
      d="M3 7h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M12 12v3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/* ================= HOME ================= */

export default function Home() {
  const { t } = useTranslation();
  const { user, users } = useAuth();
  const rolesCount = new Set(users.map((u) => u.role)).size;

  const videos = ["/hero-bg.mp4", "/hero-bg-2.mp4", "/hero-bg-3.mp4"];
  const [videoIndex, setVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setVideoIndex((prev) => (prev + 1) % videos.length);
  };

  return (
    <div className="space-y-10 pb-10">
      {/* ================= HERO ================= */}
      <section
        className="relative text-white pt-32 pb-32 flex items-center overflow-hidden h-[85vh] min-h-[600px]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 85%, 65% 100%, 0 100%)" }}
      >

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            key={videos[videoIndex]}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          >
            <source src={videos[videoIndex]} type="video/mp4" />
          </video>
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="px-6 md:px-20 relative z-10 flex flex-col md:flex-row items-center justify-start gap-12 w-full">
          <div className="space-y-6 max-w-full md:max-w-2xl lg:max-w-3xl z-20 relative">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {t('home.welcomeTo')} <br className="md:hidden" /> NEXUS <br className="hidden md:block" /> {t('home.portal')}
            </h1>

            <p className="opacity-90 text-lg md:text-xl text-gray-200 hide-scrollbar leading-relaxed">
              {t('home.heroDesc')}
            </p>

            {user && (
              <p className="mt-2 text-indigo-200 font-medium">
                {t('home.loggedInAs')} <b>{user.name || user.email}</b> ({user.role})
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-indigo-500/30 transition flex items-center gap-2 group"
              >
                {t('home.getStarted')}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                to="/what-we-do" target="_blank"
                className="px-8 py-3 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition backdrop-blur-sm"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </div>

          {/* Hero Circles (Responsive Visibility & Positioning) */}
          <div className="hidden sm:block sm:absolute sm:right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 w-[380px] h-[300px] z-10 sm:scale-50 md:scale-75 lg:scale-90 xl:scale-100 origin-right transition-all duration-300 pointer-events-none">
            <Circle
              image={imgB}
              size="w-44 h-44"
              ring="border-[7px]"
              arc="border-green-400 border-t-[10px] border-r-[10px]"
              position="right-0 top-0"
            />

            <Circle
              image={imgA}
              size="w-28 h-28"
              ring="border-[6px]"
              arc="border-green-400 border-l-[8px] border-b-[8px]"
              position="left-6 top-6"
            />

            <Circle
              image={imgC}
              size="w-36 h-36"
              ring="border-[7px]"
              arc="border-green-400 border-b-[10px] border-r-[10px]"
              position="left-24 bottom-0"
            />
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title={t('home.activeUsers')} value={users.length} />
        <StatCard title={t('home.rolesSupported')} value={rolesCount} />
        <StatCard title={t('home.systemStatus')} value={t('home.operational')} />
      </section>

      {/* ================= ACTIONS ================= */}
      <section className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.role === "Admin" && (
          <ActionCard
            title={t('home.userManagement')}
            desc={t('home.viewManageUsers')}
            to="/users"
            icon={<UserManagementIcon />}
          />
        )}

        <ActionCard
          title={t('common.profile')}
          desc={t('home.viewSessionDetails')}
          to="/profile"
          icon={<ProfileIcon />}
        />

        <ActionCard
          title={t('common.reports')}
          desc={t('home.generateReports')}
          to="/reports"
          icon={<ReportsIcon />}
        />

        <ActionCard
          title={t('common.projects')}
          desc={t('home.manageProjectsDesc')}
          to="/projects"
          icon={<ProjectIcon />}
        />
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */



const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition dark:bg-slate-800 dark:border dark:border-slate-700">
    <p className="text-gray-500 dark:text-gray-400">{title}</p>
    <p className="text-2xl font-bold mt-2 dark:text-white">{value}</p>
  </div>
);

const Circle = ({ image, size, ring, arc, position }) => (
  <div className={`absolute ${position}`}>
    <div className={`relative ${size} rounded-full border-gray-200 ${ring}`}>
      <img
        src={image}
        alt=""
        className="w-full h-full rounded-full object-cover"
      />
      <div
        className={`absolute inset-[-10px] rounded-full border-transparent ${arc}`}
      />
    </div>
  </div>
);

const ActionCard = ({ title, desc, to, icon }) => (
  <Link
    to={to}
    className="bg-white p-6 rounded-xl shadow hover:shadow-lg flex items-center space-x-4 transition dark:bg-slate-800 dark:border dark:border-slate-700 dark:hover:bg-slate-700/80"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 dark:bg-slate-900/50">
      {icon}
    </div>

    <div>
      <h3 className="font-semibold dark:text-white">{title}</h3>
      <p className="text-gray-500 mt-1 dark:text-gray-400">{desc}</p>
    </div>
  </Link>
);
