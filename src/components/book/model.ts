export interface Book {
    id: number;
    title: string;
    author_id: number | string;
    publication_year: number | string | null;
    description: string;
    cover: string;
    slug: string;
    genres: Genre[];
    genre_ids: number[];
}

export interface Genre {
    id: number;
}

export interface Author {
    id: number;
}

export interface ResponseData<T = undefined> { 
    error?: boolean; 
    message?: string; 
    Data?: T
}
