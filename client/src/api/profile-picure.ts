const API_URL = import.meta.env.VITE_API_URL;

export function profilePictureURL(account_id: number, version?: number): string {
    return `${API_URL}/accounts/${account_id}/profile-picture${version ? `?v=${version}` : "" }`;
}

export async function uploadProfilePicture(file: File): Promise<void> {
    const body = new FormData();
    body.append("image", file);

    const response = await fetch(`${API_URL}/accounts/me/profile-picture`, {
        method: "PUT",
        credentials: "include",
        body, 
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Could not upload image!");
    }
}

export async function deleteProfilePicture(): Promise<void> {
    const response = await fetch(`${API_URL}/accounts/me/profile-picture`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) throw new Error("Could not remove profile picture!");
}