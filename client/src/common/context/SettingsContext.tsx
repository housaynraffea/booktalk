import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useCookieSetting } from "@/common/hooks/cookieSettings.ts";

interface Settings {
    theme: string;
    setTheme: (value: string) => void;
    showRecommended: boolean;
    setShowRecommended: (value: boolean) => void;
    showPopular: boolean;
    setShowPopular: (value: boolean) => void;
    showCover: boolean;
    setShowCover: (value: boolean) => void;
    showProfilePicture: boolean;
    setShowProfilePicture: (value: boolean) => void;
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({children}: { children: ReactNode }) {
    const [theme, setTheme] = useCookieSetting<string>('Theme', 'dark');
    const [showRecommended, setShowRecommended] = useCookieSetting<boolean>('ShowRecommended', true);
    const [showPopular, setShowPopular] = useCookieSetting<boolean>('ShowPopular', true);
    const [showCover, setShowCover] = useCookieSetting<boolean>('ShowCover', true);
    const [showProfilePicture, setShowProfilePicture] = useCookieSetting<boolean>('ShowProfilePicture', true);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const value = useMemo(
        () => ({
            theme, setTheme,
            showRecommended, setShowRecommended,
            showPopular, setShowPopular,
            showCover, setShowCover,
            showProfilePicture, setShowProfilePicture,
        }), [
            theme, setTheme,
            showRecommended, setShowRecommended,
            showPopular, setShowPopular,
            showCover, setShowCover,
            showProfilePicture, setShowProfilePicture,
        ]
    )

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error ('useSettings MUST be used inside SettingsProvider!');
    return context;
}