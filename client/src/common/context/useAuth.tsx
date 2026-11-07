import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchCurrentUser, loginAccount, logoutAccount, registerAccount, type CurrentUser, type RegisterInput } from "@/api/auth";

interface AuthState {
    user: CurrentUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: {children: ReactNode}) {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        fetchCurrentUser(abortController.signal)
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => {
                if (!abortController.signal.aborted) setIsLoading(false);
            });
        
        return () => abortController.abort();
    }, []);

    const value = useMemo<AuthState>(() => ({
        user,
        isLoading,
        login: async (email, password) => setUser(await loginAccount(email, password)),
        register: async (input) => setUser(await registerAccount(input)),
        logout: async () => {
            await logoutAccount();
            setUser(null);
        },  
    }), [user, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context =  useContext(AuthContext);
    if (!context) throw new Error('useAuth MUST be inside AuthProvider!');
    return context;
}