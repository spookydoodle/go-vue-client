import { ResponseData, Book } from './model';

export const getAllBooks = async (): Promise<Book[]> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/books`);
    const response = await res.json() as ResponseData<{ books: Book[] }>;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when fetching books data.')
    }

    return response.Data?.books ?? [];
}