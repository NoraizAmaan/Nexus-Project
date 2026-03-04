import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/* ================= ICONS (INLINE SVGs) ================= */

const ConnectivityIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full text-indigo-400 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const UserManagementIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-indigo-600">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ProjectTrackingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-indigo-600">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ReportingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-indigo-600">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 17l-6-6-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HelpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-indigo-600">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function WhatWeDo() {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-900 transition-colors duration-200">
            {/* ================= HERO ================= */}
            <section
                className="relative text-white pt-32 pb-32 flex items-center overflow-hidden h-[85vh] min-h-[600px]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 85%, 65% 100%, 0 100%)" }}
            >
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src="/What-we-do-banner.mov" type="video/quicktime" />
                        <source src="/What-we-do-banner.mp4" type="video/mp4" />
                    </video>
                    {/* Dark Overlay with texture effect */}
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                </div>

                <div className="px-6 md:px-20 relative z-10 flex flex-col md:flex-row items-center justify-start gap-12 w-full">
                    {/* Hero Content */}
                    <div className="space-y-6 max-w-full md:max-w-2xl lg:max-w-3xl z-20 relative">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                            {t('whatWeDo.heroTitle1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                {t('whatWeDo.heroTitle2')}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                            {t('whatWeDo.heroDesc')}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-8">
                            <Link
                                to="/register"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                            >
                                {t('whatWeDo.getStarted')}
                            </Link>
                        </div>
                    </div>

                    {/* Hero SVG/Illustration */}
                    <div className="hidden lg:block w-[400px] h-[400px] relative animate-float">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <ConnectivityIcon />
                    </div>
                </div>
            </section>

            {/* ================= FEATURES SECTION ================= */}
            <section className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <FeatureCard
                        icon={<UserManagementIcon />}
                        title={t('whatWeDo.userManagementTitle')}
                        desc={t('whatWeDo.userManagementDesc')}
                    />
                    <FeatureCard
                        icon={<ProjectTrackingIcon />}
                        title={t('whatWeDo.projectTrackingTitle')}
                        desc={t('whatWeDo.projectTrackingDesc')}
                    />
                    <FeatureCard
                        icon={<ReportingIcon />}
                        title={t('whatWeDo.reportingTitle')}
                        desc={t('whatWeDo.reportingDesc')}
                    />
                    <FeatureCard
                        icon={<HelpIcon />}
                        title={t('whatWeDo.helpSystemTitle')}
                        desc={t('whatWeDo.helpSystemDesc')}
                    />
                </div>
            </section>

            {/* ================= CTA SECTION ================= */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
                        {t('whatWeDo.joinUs')}
                    </h2>
                    <Link
                        to="/register"
                        className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl"
                    >
                        {t('home.getStarted')}
                    </Link>
                </div>
            </section>
        </div>
    );
}

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="mb-6 relative z-10">{icon}</div>
        <h3 className="text-2xl font-bold mb-4 dark:text-white relative z-10">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">{desc}</p>
    </div>
);
