export type Comment = {
    comment_id: number;
    account_id: number;
    review_id: number;
    comment: string;
    likes: number;
    dislikes: number;
    created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL;

