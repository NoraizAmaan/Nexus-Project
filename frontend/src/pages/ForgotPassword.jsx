import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const isEmailValid = /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid) return;

        setLoading(true);
        const result = await forgotPassword(email);
        setLoading(false);

        if (result.success) {
            setMsg(`✅ ${t('auth.resetLinkSent')}`);
        } else {
            setMsg(`❌ ${result.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-200">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5 dark:bg-slate-800 dark:border dark:border-slate-700 transition-colors duration-200"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('auth.forgotPasswordHeader')}</h2>
                    <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
                        {t('auth.forgotPasswordDesc')}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('auth.email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 transition-colors duration-200"
                        required
                    />
                </div>

                <button
                    disabled={!isEmailValid || loading}
                    className={`w-full py-2.5 rounded-lg font-semibold transition
            ${isEmailValid && !loading
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {loading ? t('auth.sending') : t('auth.sendResetLink')}
                </button>

                {msg && (
                    <p className={`text-center text-sm font-medium mt-2 ${msg.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
                        {msg}
                    </p>
                )}

                <div className="text-center mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        {t('auth.backToLogin')}
                    </button>
                </div>
            </form>
        </div>
    );
}
