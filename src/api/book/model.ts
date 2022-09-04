export interface Book {
    id: number;
    title: string;
    author_id: number | string;
    author?: Author;
    publication_year: number | string | null;
    description: string;
    cover: string;
    slug: string;
    genres?: Genre[];
    genre_ids: number[];
}

/**
 * @param created_at Creation date in ISO format (UTC timezone);
 * @param updated_at Last update date in ISO format (UTC timezone);
 */
export interface Genre {
    id: number;
    genre_name: string;
    created_at: string;
    updated_at: string;
}

/**
 * @param created_at Creation date in ISO format (UTC timezone);
 * @param updated_at Last update date in ISO format (UTC timezone);
 */
export interface Author {
    id: number;
    author_name: string;
    created_at: string;
    updated_at: string;
}
