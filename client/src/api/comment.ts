export type Comment = {
    comment_id: number;
    account_id: number;
    review_id: number;
    comment: string;
    likes: number;
    dislikes: number;
    created_at: string;
}