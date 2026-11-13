export type Book = {
    key: string;
    title: string;
    description: string;
    authors: string;
    cover: number | null;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function searchBooks(searchText: string, signal: AbortSignal): Promise<Book[]> {
    const response = await fetch(
        `${API_URL}/books/search?q=${encodeURIComponent(searchText)}`,
        { signal });
    
    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();
    return data.books;
}

export async function getBook(searchText: string, signal: AbortSignal): Promise<Book | null> {
    const response = await fetch(
        `${API_URL}/books/${encodeURIComponent(searchText)}`,
        { signal });
    
    if (response.status === 400) return null;
    if (!response.ok) throw new Error("Book search failed");
    return await response.json();
}

export function coverURL(coverId: number | null, size: "S" | "M" | "L" = "M") {
    if (!coverId) return "/cover-placeholder.svg"
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}