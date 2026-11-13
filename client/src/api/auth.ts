const API_URL = import.meta.env.VITE_API_URL;

export const PASSWORD_MIN = 3;

export type CurrentUser = {
    account_id: number;
    username: string;
    display_name: string;
}

export type RegisterInput = {
    email: string;
    username: string;
    display_name: string;
    password: string;
}

async function sendRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        credentials: 'include',
        headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
        ...options,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.error ?? "Something went wrong!");
    
    return data as T;
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser | null> {
    const data = await sendRequest<{ user: CurrentUser | null }>('/auth/me', { signal });
    
    return data.user;
}

export async function loginAccount(email: string, password: string): Promise<CurrentUser> {
    const data = await sendRequest<{ user: CurrentUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    return data.user;
}

export async function registerAccount(input: RegisterInput): Promise<CurrentUser> {
    const data = await sendRequest<{ user: CurrentUser }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return data.user;
}

export async function logoutAccount(): Promise<void> {
    await sendRequest('/auth/logout', { method: 'POST' });
}