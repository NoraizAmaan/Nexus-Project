import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const { t } = useTranslation();
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      handleTokenLogin(token);
    } else if (error) {
      setMsg(`❌ ${t('auth.loginFailed') || 'Authentication failed'}`);
    }
  }, [searchParams]);

  const handleTokenLogin = async (token) => {
    setMsg("⌛ Authenticating...");
    const result = await loginWithToken(token);
    if (result.success) {
      setMsg(`✅ ${t('auth.loginSuccess')}`);
      setTimeout(() => navigate("/"), 1000);
    } else {
      setMsg(`❌ ${result.message}`);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/microsoft";
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const result = await login(email, password);

    if (!result.success) {
      setMsg(`❌ ${result.message}`);
      return;
    }

    setMsg(`✅ ${t('auth.loginSuccess')}`);
    setTimeout(() => navigate("/"), 1000);
  };

  // --- Eye Icons ---
  const Eye = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOff = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.97 10.97 0 0112 20c-5.05 0-9.27-3.11-11-7 1.09-2.42 2.89-4.46 5.13-5.88" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9.88 9.88a3 3 0 104.24 4.24" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-200">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5 dark:bg-slate-800 dark:border dark:border-slate-700 transition-colors duration-200"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('auth.welcomeBack')}</h2>
          <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
            {t('auth.loginToContinue')}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('auth.email')}</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 transition-colors duration-200"
          />
          {!isEmailValid && email && (
            <p className="text-xs text-red-500 mt-1">{t('auth.invalidEmail')}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('auth.password')}</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 transition-colors duration-200"
            />
            <span
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {showPwd ? EyeOff : Eye}
            </span>
          </div>
          {!isPasswordValid && password && (
            <p className="text-xs text-red-500 mt-1">
              {t('auth.passwordMinLength')}
            </p>
          )}
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              {t('auth.forgotPasswordLink')}
            </button>
          </div>
        </div>

        <button
          disabled={!isFormValid}
          className={`w-full py-2.5 rounded-lg font-semibold transition
            ${isFormValid
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {t('common.login')}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
              {t('auth.orContinueWith') || 'Or continue with'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t('auth.continueWithGoogle') || 'Continue with Google'}
        </button>

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          {t('auth.continueWithMicrosoft') || 'Continue with Microsoft'}
        </button>

        {
          msg && (
            <p className={`text-center text-sm font-medium mt-2 ${msg.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
              {msg}
            </p>
          )
        }

        {/* Toggle to Register */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.dontHaveAccount')}{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {t('auth.registerHere')}
            </button>
          </p>
        </div>

        <div className="text-center mt-2">
          <Link to="/help?tab=login-issues" className="text-xs text-gray-400 hover:text-gray-600">
            {t('auth.needHelpLogin')}
          </Link>
        </div>
      </form >
    </div >
  );
}
