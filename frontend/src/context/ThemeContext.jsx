import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 'device', 'dark', 'light'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("nexus_theme") || "device";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        localStorage.setItem("nexus_theme", theme);

        const applyTheme = (isDark) => {
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (theme === "device") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
            applyTheme(systemTheme.matches);

            const listener = (e) => applyTheme(e.matches);
            systemTheme.addEventListener("change", listener);
            return () => systemTheme.removeEventListener("change", listener);
        } else if (theme === "dark") {
            applyTheme(true);
        } else {
            applyTheme(false);
        }
    }, [theme]);

    // Special case: force white background by default, dark background in dark mode
    // This usually handled by global css, but we can ensure it here if needed generally, 
    // but Tailwind handles 'dark:bg-slate-900' usage in components.

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
