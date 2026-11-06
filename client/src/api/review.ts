export type Review = {
    review_id: number;
    book_key: string;
    account_id: number;
    cover: number | null;
    title: string;
    authors: string;
    stars: number;
    description: string | null;
    likes: number;
    created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getAccountReviews(account_id: number, signal?: AbortSignal): Promise<Review[]> {
    const response = await fetch(`${API_URL}/accounts/${account_id}/reviews`, { signal });

    if (!response.ok) throw new Error("Could not find account!");
    const data = await response.json();
    return data.reviews;
}