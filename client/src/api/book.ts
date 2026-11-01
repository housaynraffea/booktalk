export type BookSearchResult = {
    key: string;
    title: string;
    authors: string;
    cover: number | null;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function searchBooks(searchText: string, signal: AbortSignal): Promise<BookSearchResult[]> {
    const response = await fetch(
        `${API_URL}/books/search?q=${encodeURIComponent(searchText)}`,
        { signal });
    
    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();
    return data.books;
}

export function coverURL(coverId: number | null, size: "S" | "M" | "L" = "M") {
    if (!coverId) return "/cover-placeholder.svg"
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}