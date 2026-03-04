import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Help() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentTab = searchParams.get("tab") || "center";

    const setTab = (tab) => {
        setSearchParams({ tab });
    };

    const tabs = [
        { id: "center", label: t('help.tabs.center'), icon: <HomeIcon /> },
        { id: "faq", label: t('help.tabs.faq'), icon: <QuestionMarkCircleIcon /> },
        { id: "terms", label: t('help.tabs.terms'), icon: <DocumentTextIcon /> },
        { id: "login-issues", label: t('help.tabs.loginIssues'), icon: <KeyIcon /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-slate-900 transition-colors">
            <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 dark:text-gray-400">{t('help.support')}</h3>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentTab === tab.id
                                ? "bg-indigo-50 text-indigo-700 dark:bg-slate-700 dark:text-indigo-400"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] dark:bg-slate-800 dark:border-slate-700">
                    {currentTab === "center" && <HelpCenter />}
                    {currentTab === "faq" && <FAQ />}
                    {currentTab === "terms" && <PrivacyTerms />}
                    {currentTab === "login-issues" && <LoginTroubleshoot />}
                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

function HelpCenter() {
    const { t } = useTranslation();
    const [activeArticle, setActiveArticle] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const articles = {
        gettingStarted: {
            title: t('help.helpCenter.gettingStarted'),
            content: "Welcome to Nexus Portal! To get started, you should first explore your Dashboard which provides an overview of your active projects and recent notifications. Make sure your profile information is up to date to receive relevant updates."
        },
        profileSecurity: {
            title: t('help.helpCenter.profileSecurity'),
            content: "Your security is our priority. You can manage your personal details, change your profile picture, and update your security settings. Remember to use a strong password and never share your credentials."
        },
        projects: {
            title: t('help.helpCenter.projects'),
            content: "The Projects section allows you to view all projects you are involved in. You can track progress, view member lists, and access project-specific documentation and reports."
        }
    };

    if (activeArticle) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setActiveArticle(null)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('common.back')}
                </button>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{articles[activeArticle].title}</h2>
                    <div className="prose prose-indigo max-w-none dark:prose-invert">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {articles[activeArticle].content}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('help.helpCenter.title')}</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('help.helpCenter.searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                    <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Filtered Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {[
                    { id: "gettingStarted", title: t('help.helpCenter.gettingStarted'), desc: t('help.helpCenter.gettingStartedDesc'), icon: "🚀" },
                    { id: "profileSecurity", title: t('help.helpCenter.profileSecurity'), desc: t('help.helpCenter.profileSecurityDesc'), icon: "👤" },
                    { id: "projects", title: t('help.helpCenter.projects'), desc: t('help.helpCenter.projectsDesc'), icon: "folder" },
                ].filter(item =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((item, i) => (
                    <div
                        key={i}
                        onClick={() => setActiveArticle(item.id)}
                        className="p-6 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group dark:border-slate-700 dark:hover:border-slate-600"
                    >
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:bg-indigo-100 dark:bg-slate-700 dark:group-hover:bg-slate-600">
                            {item.icon === "folder" ? (
                                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            ) : item.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                ))}

                {/* No results message */}
                {[
                    { id: "gettingStarted", title: t('help.helpCenter.gettingStarted'), desc: t('help.helpCenter.gettingStartedDesc'), icon: "🚀" },
                    { id: "profileSecurity", title: t('help.helpCenter.profileSecurity'), desc: t('help.helpCenter.profileSecurityDesc'), icon: "👤" },
                    { id: "projects", title: t('help.helpCenter.projects'), desc: t('help.helpCenter.projectsDesc'), icon: "folder" },
                ].filter(item =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No articles found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or browse our FAQs.</p>
                        </div>
                    )}
            </div>

            <div className="bg-indigo-50 rounded-xl p-6 mt-8 flex items-center justify-between dark:bg-slate-700/50">
                <div>
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">{t('help.helpCenter.stillNeedHelp')}</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">{t('help.helpCenter.supportTeamDesc')}</p>
                </div>
                <button
                    onClick={() => window.location.href = "mailto:support@nexus.com"}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium">{t('help.helpCenter.contactSupport')}</button>
            </div>
        </div>
    );
}

function FAQ() {
    const { t } = useTranslation();
    const faqs = [
        { q: t('help.faq.q1'), a: t('help.faq.a1') },
        { q: t('help.faq.q2'), a: t('help.faq.a2') },
        { q: t('help.faq.q3'), a: t('help.faq.a3') },
        { q: t('help.faq.q4'), a: t('help.faq.a4') },
    ];
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('help.faq.title')}</h2>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-gray-50 rounded-lg p-4 open:bg-white open:shadow-sm open:ring-1 open:ring-black/5 dark:bg-slate-700/50 dark:open:bg-slate-700">
                        <summary className="flex items-center justify-between font-medium cursor-pointer list-none text-gray-800 dark:text-gray-200">
                            <span>{faq.q}</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-600 mt-3 group-open:animate-fadeIn text-sm leading-relaxed dark:text-gray-400">
                            {faq.a}
                        </p>
                    </details>
                ))}
            </div>
        </div>
    )
}

function PrivacyTerms() {
    return (
        <div className="prose prose-indigo max-w-none dark:prose-invert">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy & Terms of Service</h2>

            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Data Protection</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 dark:text-gray-400">
                    At Nexus, we take your data privacy seriously. All sensitive data is encrypted at rest and in transit using industry-standard protocols. We do not share your personal information with third parties without your explicit consent.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">2. User Responsibilities</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 dark:text-gray-400">
                    Users are responsible for maintaining the confidentiality of their account credentials. Any activity that occurs under your account is your responsibility. Please notify us immediately of any unauthorized use.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">3. Service Availability</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 dark:text-gray-400">
                    We strive for 99.9% uptime. However, scheduled maintenance may occur. We will notify users in advance of any planned downtime.
                </p>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            Last updated: March 03, 2026. If you have any questions about these terms, please contact our legal team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoginTroubleshoot() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('help.troubleshoot.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('help.troubleshoot.desc')}</p>

            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400">1</div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('help.troubleshoot.forgotPassword')}</h4>
                        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                            {t('help.troubleshoot.forgotPasswordDesc')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400">2</div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('help.troubleshoot.accountLocked')}</h4>
                        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                            {t('help.troubleshoot.accountLockedDesc')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30 dark:text-blue-400">3</div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{t('help.troubleshoot.clearCache')}</h4>
                        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                            {t('help.troubleshoot.clearCacheDesc')}
                        </p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-slate-700/50 dark:border-slate-600">
                    <h5 className="font-medium text-gray-900 dark:text-white">{t('help.troubleshoot.stillCantLog')}</h5>
                    <p className="text-sm text-gray-600 mt-1 mb-3 dark:text-gray-400">{t('help.troubleshoot.contactSupportManual')}</p>
                    <a href="mailto:support@nexus.com" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                        {t('help.troubleshoot.emailSupport')} &rarr;
                    </a>
                </div>
            </div>
        </div>
    )
}

// --- Icons ---
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)

const QuestionMarkCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const DocumentTextIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)

const KeyIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
)
