export type Account = {
    account_id: number;
    display_name: string;
    username: string;
    bio: string | null;
    favourite_book_key: string | null;
    favourite_book_title: string | null;
    favourite_book_cover: number | null;
    created_at: string;
}

export type AccountSearchResult = Pick<Account, 'account_id' | 'username' | 'display_name' >;

const API_URL = import.meta.env.VITE_API_URL;

export const DISPLAY_NAME_MIN = 3
export const DISPLAY_NAME_MAX = 64

export const USERNAME_MIN = 3
export const USERNAME_MAX = 32
export const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/

export function validateDisplayName(display_name: string): string | null {
    const value = display_name.trim()
    if (value.length < DISPLAY_NAME_MIN || value.length > DISPLAY_NAME_MAX) {
        return `Display name must be between ${DISPLAY_NAME_MIN}-${DISPLAY_NAME_MAX} characters.`;
    }

    return null;
}

export function validateUsername(username: string): string | null {
    const value = username.trim()
    if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
        return `Username must be between ${USERNAME_MIN}-${USERNAME_MAX} characters.`;
    }
    
    if (!USERNAME_PATTERN.test(value)) {
        return 'Username can only contain letters, numbers and underscores.';
    }

    return null;
}

export async function searchAccounts(searchText: string, signal: AbortSignal): Promise<AccountSearchResult[]> {
    const response = await fetch(
        `${API_URL}/accounts/search?q=${encodeURIComponent(searchText)}`,
        { signal });
    
    if (!response.ok) throw new Error("Account search failed!");
    const data = await response.json();
    return data.accounts;
}

export async function getAccount(account_id: number, signal?: AbortSignal): Promise<Account | null> {
    const response = await fetch(`${API_URL}/accounts/${account_id}`, { signal });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Could not find account!");
    return await response.json();
};

export async function getAccountByUsername(username: string, signal?: AbortSignal): Promise<Account | null> {
    const response = await fetch(`${API_URL}/accounts/by-username/${encodeURIComponent(username)}`, { signal });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Could not find account!");
    return await response.json();
}

export async function isUsernameTaken(username: string, signal?: AbortSignal): Promise<boolean> {
    const response = await fetch(
        `${API_URL}/accounts/username-available?username=${encodeURIComponent(username)}`,
        { signal });
    
    if (!response.ok) throw new Error("Username check failed!");
    const data = await response.json();
    return !data.available;
}
