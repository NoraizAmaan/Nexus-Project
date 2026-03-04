import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isHiding, setIsHiding] = useState(false);
  const isFullWidthPage = location.pathname === "/" || location.pathname === "/what-we-do";

  useEffect(() => {
    const handleScroll = () => {
      // Hide the button (tuck it away) when scrolling down
      if (window.scrollY > 50) {
        setIsHiding(true);
      } else {
        setIsHiding(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className={`min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200 ${!isFullWidthPage ? "p-6 md:p-8" : ""
        }`}>
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-white py-6 mt-10 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
          <div>
            <h3 className="font-bold mb-2">NEXUS</h3>
            <p className="text-gray-400 text-sm">{t('common.footerDesc')}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">{t('common.quickLinks')}</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li><a href="/" className="hover:text-white">{t('common.dashboard')}</a></li>
              <li><a href="/what-we-do" className="hover:text-white">{t('common.whatWeDo')}</a></li>
              <li><a href="/users" className="hover:text-white">{t('common.users')}</a></li>
              <li><a href="/help" className="hover:text-white">{t('common.helpCenter')}</a></li>
              <li><a href="/profile" className="hover:text-white">{t('common.profile')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">{t('common.contact')}</h3>
            <p className="text-gray-400 text-sm">support@nexus.com</p>
            <p className="text-gray-400 text-sm">+1 (123) 456-7890</p>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          {t('common.allRightsReserved')}
        </p>
      </footer>

      {/* Floating Help Button with Peek-a-boo animation */}
      <div
        className={`fixed bottom-0 right-0 p-6 z-50 group transition-all duration-500 transform ${isHiding ? "translate-x-1/3 translate-y-1/3 opacity-80" : "translate-x-0 translate-y-0 opacity-100"
          } hover:translate-x-0 hover:translate-y-0 hover:opacity-100`}
      >
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700">
          {t('common.needHelp')}
        </div>
        <a
          href="/help"
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-110 transition-all duration-300 ring-4 ring-white dark:ring-slate-800 group-hover:rotate-12"
          aria-label={t('common.helpCenter')}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>
      </div>
    </>
  );
}
