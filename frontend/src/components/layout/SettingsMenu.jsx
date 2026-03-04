import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

// --- Sub-components (outside to prevent remounting) ---

const Header = ({ title, onBack }) => (
    <div className="flex items-center gap-3 px-4 py-3 border-b mb-1 dark:border-slate-700">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-full text-gray-500 dark:hover:bg-slate-700 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    </div>
);

const DisplayView = ({ theme, setTheme, setView, t }) => (
    <div>
        <Header title={t('common.settings')} onBack={() => setView("main")} />
        <div className="px-4 pb-4">
            <h4 className="font-semibold text-sm text-gray-900 mb-1 dark:text-gray-200">{t('common.darkMode')}</h4>
            <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">Choose how your Portal experience looks for this device.</p>

            <div className="space-y-3">
                {["device", "dark", "light"].map((mode) => (
                    <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="darkMode"
                            className="text-indigo-600 focus:ring-indigo-500"
                            checked={theme === mode}
                            onChange={() => setTheme(mode)}
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                            {mode === "device" ? t('common.deviceSettings') : mode === "dark" ? t('common.alwaysOn') : t('common.alwaysOff')}
                        </span>
                    </label>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 leading-normal dark:text-gray-500">
                If you choose Device settings, this app will use the mode that’s already selected in this device’s settings.
            </p>
        </div>
    </div>
);

const LanguageView = ({ setView, i18n, t }) => {
    const languages = [
        { name: "English", code: "en" },
        { name: "Hindi", code: "hi" },
        { name: "Spanish", code: "es" },
        { name: "French", code: "fr" },
        { name: "Chinese", code: "zh" },
        { name: "Telugu", code: "te" },
        { name: "Bangla", code: "bn" },
        { name: "Arabic", code: "ar" }
    ];

    return (
        <div>
            <Header title={t('common.language')} onBack={() => setView("main")} />
            <div className="px-4 pb-4">
                <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">
                    {t('common.selectLanguage')}
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {languages.map(lang => (
                        <label
                            key={lang.code}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded dark:hover:bg-slate-700/50"
                        >
                            <input
                                type="radio"
                                name="language"
                                className="text-indigo-600 focus:ring-indigo-500"
                                checked={i18n.language === lang.code}
                                onChange={() => i18n.changeLanguage(lang.code)}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {lang.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HelpView = ({ setView, t }) => (
    <div>
        <Header title={t('common.help')} onBack={() => setView("main")} />
        <div className="px-4 pb-4 space-y-3">
            <div className="space-y-1 border-b border-gray-50 pb-2 dark:border-slate-700">
                <Link to="/help" className="flex items-center justify-between text-sm text-gray-700 hover:text-indigo-600 py-2 dark:text-gray-300 dark:hover:text-indigo-400">
                    <span>{t('help.tabs.center')}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </Link>
                <Link to="/help?tab=faq" className="flex items-center justify-between text-sm text-gray-700 hover:text-indigo-600 py-2 dark:text-gray-300 dark:hover:text-indigo-400">
                    <span>{t('help.tabs.faq')}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </Link>
                <Link to="/help?tab=terms" className="flex items-center justify-between text-sm text-gray-700 hover:text-indigo-600 py-2 dark:text-gray-300 dark:hover:text-indigo-400">
                    <span>{t('help.tabs.terms')}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </Link>
            </div>

            <div className="pt-1">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-gray-400">{t('help.activityHelp')}</h4>
                <div className="space-y-1">
                    <Link to="/profile" className="block text-sm text-gray-700 hover:text-indigo-600 py-1 dark:text-gray-300 dark:hover:text-indigo-400">{t('profile.myProfile')}</Link>
                    <Link to="/help?tab=login-issues" className="block text-sm text-gray-700 hover:text-indigo-600 py-1 dark:text-gray-300 dark:hover:text-indigo-400">{t('help.tabs.loginIssues')}</Link>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Component ---

export default function SettingsMenu({ user, logout, close }) {
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [view, setView] = useState("main");
    const menuRef = useRef(null);

    // Sub-components moved inside but as regular render blocks for simplicity and reliability
    const MainView = () => (
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Mobile Navigation */}
            <div className="lg:hidden border-b border-gray-100 dark:border-slate-700 pb-2 mb-2">
                <Link to="/" onClick={close} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300">{t('common.dashboard')}</Link>
                <Link to="/what-we-do" onClick={close} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300">{t('common.whatWeDo')}</Link>
                <Link to="/reports" onClick={close} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300">{t('common.reports')}</Link>
                <Link to="/projects" onClick={close} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300">{t('common.projects')}</Link>
                {user?.role === "Admin" && (
                    <Link to="/users" onClick={close} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300">{t('common.users')}</Link>
                )}
            </div>

            {/* Profile */}
            <Link to="/profile" className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 transition-colors dark:hover:bg-slate-700" onClick={close}>
                <svg className="w-5 h-5 mt-0.5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                <div className="text-left">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{t('common.profile')}</p>
                    <p className="text-sm text-gray-500">{t('common.viewManageAccount')}</p>
                </div>
            </Link>

            <hr className="border-gray-100 my-1 dark:border-slate-700" />

            {/* Settings */}
            <button type="button" onClick={() => setView("display")} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors group dark:hover:bg-slate-700">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" /><path d="M3 12h2M19 12h2M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
                    </svg>
                    <span className="text-gray-800 font-normal dark:text-gray-200">{t('common.settings')}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Language */}
            <button type="button" onClick={() => setView("language")} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors group dark:hover:bg-slate-700">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5h12M9 3v2M5 21h12M9 19v2M6 8c2 4 6 8 12 10" /></svg>
                    <span className="text-gray-800 font-normal dark:text-gray-200">{t('common.language')}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Help */}
            <button type="button" onClick={() => setView("help")} className="w-full flex items-start justify-between px-4 py-3 hover:bg-gray-100 transition-colors group dark:hover:bg-slate-700">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 115 1c0 2-2.5 2-2.5 4" /><circle cx="12" cy="17" r="0.5" />
                    </svg>
                    <div className="text-left">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{t('common.help')}</p>
                        <p className="text-sm text-gray-500">{t('common.helpCenterTerms')}</p>
                    </div>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            <hr className="border-gray-100 my-1 dark:border-slate-700" />

            {/* Logout */}
            <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/10">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
                <span className="font-medium">{t('common.logout')}</span>
            </button>
        </div>
    );

    return (
        <div
            ref={menuRef}
            className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-[100] origin-top-right transition-all duration-300 ease-in-out border border-gray-100 dark:bg-slate-800 dark:border-slate-700"
        >
            <div className="py-0">
                {view === "main" && <MainView />}
                {view === "display" && <DisplayView theme={theme} setTheme={setTheme} setView={setView} t={t} />}
                {view === "language" && <LanguageView setView={setView} i18n={i18n} t={t} />}
                {view === "help" && <HelpView setView={setView} t={t} />}
            </div>
        </div>
    );
}
