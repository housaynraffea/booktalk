export type Comment = {
    comment_id: number;
    account_id: number;
    review_id: number;
    comment: string;
    created_at: string;
}

export type CommentWithAccount = Comment & { 
    username: string; 
    display_name: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getComments(review_id: number, signal?: AbortSignal): Promise<CommentWithAccount[]> {
    const response = await fetch(`${API_URL}/reviews/${review_id}/comments`, { signal });

    if (!response.ok) throw new Error("Could not load comments!");
    const data = await response.json();
    return data.comments;
}

export async function addComment(review_id: number, comment: string): Promise<void> {
    const response = await fetch(`${API_URL}/reviews/${review_id}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
    });

    if (!response.ok) throw new Error("Could not post comment!");
    const data = await response.json();
    return data;
}

export async function deleteComment(comment_id: number): Promise<void> {
    const response = await fetch(`${API_URL}/reviews/comments/${comment_id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) throw new Error("Could not delete comment!");
}