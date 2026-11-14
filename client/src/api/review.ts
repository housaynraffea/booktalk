export type Review = {
    review_id: number;
    account_id: number;
    username: string;
    display_name: string;
    stars: number;
    description: string | null;
    likes: number;
    created_at: string;
    updated_at: string;
};


export type FullReview = Review & {
    book_key: string;
    title: string;
    authors: string;
    cover: number | null;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getAccountReviews(account_id: number, signal?: AbortSignal): Promise<Review[]> {
    const response = await fetch(`${API_URL}/accounts/${account_id}/reviews`, { signal });

    if (!response.ok) throw new Error("Could not find account!");
    const data = await response.json();
    return data.reviews;
}

export async function getBookReviews(book_key: string, signal?: AbortSignal): Promise<Review[]> {
    const response = await fetch(`${API_URL}/books/${encodeURIComponent(book_key)}/reviews`, { signal });

    if (!response.ok) throw new Error("Could not load review!");
    const data = await response.json();
    return data;
}

export async function getReview(review_id: number, signal?: AbortSignal): Promise<FullReview> {
    const response = await fetch(`${API_URL}/reviews/${review_id}`, { signal });

    if (!response.ok) throw new Error("Could not load review!");
    const data = await response.json();
    return data;
}

export async function saveReview(book_key: string, stars: number, description: string): Promise<void> {
    const response = await fetch(`${API_URL}/books/${encodeURIComponent(book_key)}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, description }),
    });

    if (!response.ok) throw new Error("Could not save review!");
    const data = await response.json();
    return data;
}

export async function deleteReview(review_id: number): Promise<void> {
    const response = await fetch(`${API_URL}/reviews/${review_id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) throw new Error("Could not delete review!");
    const data = await response.json();
    return data;
}