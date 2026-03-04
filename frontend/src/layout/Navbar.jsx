import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SettingsMenu from "../components/layout/SettingsMenu";
import Logo from "../assets/company-portal-logo.png";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const isTransparentPage = location.pathname === "/" || location.pathname === "/what-we-do";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on navigation or user change (logout/login)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, user]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className={`flex justify-between items-center px-6 py-4 ${isTransparentPage ? "fixed" : "sticky"} top-0 w-full z-50 transition-all duration-300 ${scrolled || !isTransparentPage
      ? "bg-slate-900 shadow-lg border-b border-slate-800"
      : "bg-transparent backdrop-blur-sm"
      }`}>
      {/* Logo */}
      <div className="flex items-center shrink-0">
        <img
          src={Logo}
          alt="Nexus"
          className="h-14 md:h-12 object-contain"
        />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        <Link className="text-white hover:text-indigo-400 font-medium transition-colors" to="/">
          {t('common.dashboard')}
        </Link>
        <Link className="text-white hover:text-indigo-400 font-medium transition-colors" to="/what-we-do">
          {t('common.whatWeDo')}
        </Link>
        <Link className="text-white hover:text-indigo-400 font-medium transition-colors" to="/reports">
          {t('common.reports')}
        </Link>
        <Link className="text-white hover:text-indigo-400 font-medium transition-colors" to="/projects">
          {t('common.projects')}
        </Link>
        {user?.role === "Admin" && (
          <Link className="text-white hover:text-indigo-400 font-medium transition-colors" to="/users">
            {t('common.users')}
          </Link>
        )}
      </nav>

      {/* Auth Section */}
      <div>
        {user ? (
          <div className="relative" ref={menuRef}>
            {/* Profile Button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-xl transition-all border border-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.email[0].toUpperCase()
                )}
              </div>

              <span className="hidden md:block font-medium text-sm">
                {user.name || "Profile"}
              </span>

              {/* Chevron */}
              <svg
                className={`w-4 h-4 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {open && (
              <SettingsMenu
                user={user}
                logout={logout}
                close={() => setOpen(false)}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link className="text-white hover:text-indigo-400 font-medium transition-colors" to="/login">
              {t('common.login')}
            </Link>
            <Link className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition" to="/register">
              {t('common.register')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
