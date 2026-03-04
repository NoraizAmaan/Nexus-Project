import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const isPasswordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword;
    const isFormValid = isPasswordValid && passwordsMatch;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        const result = await resetPassword(token, password);
        setLoading(false);

        if (result.success) {
            setMsg(`✅ ${t('auth.resetSuccess')}`);
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setMsg(`❌ ${result.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-200">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5 dark:bg-slate-800 dark:border dark:border-slate-700 transition-colors duration-200"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('auth.resetPassword')}</h2>
                    <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">
                        {t('auth.resetPasswordDesc')}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('auth.newPassword')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 transition-colors duration-200"
                        required
                    />
                    {!isPasswordValid && password && (
                        <p className="text-xs text-red-500 mt-1">{t('auth.passwordMinLength')}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('auth.confirmPassword')}</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-gray-500 transition-colors duration-200"
                        required
                    />
                    {!passwordsMatch && confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{t('auth.passwordsDoNotMatch')}</p>
                    )}
                </div>

                <button
                    disabled={!isFormValid || loading}
                    className={`w-full py-2.5 rounded-lg font-semibold transition
            ${isFormValid && !loading
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {loading ? t('auth.resetting') : t('auth.resetPassword')}
                </button>

                {msg && (
                    <p className={`text-center text-sm font-medium mt-2 ${msg.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
                        {msg}
                    </p>
                )}
            </form>
        </div>
    );
}
