import Security from '@/components/security';
import { ResponseData, Book, Author } from './model';

export const getAll = async (): Promise<Book[]> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/books`);
    const response = await res.json() as ResponseData<{ books: Book[] }>;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when fetching books data.')
    }

    return response.Data?.books ?? [];
}

export const getOne = async (bookName: string): Promise<Book | undefined> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/books/${bookName}`);
    const response = await res.json() as ResponseData<Book>;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when fetching book data.')
    }

    return response.Data;
};

export const getOneAdmin = async (bookId: number): Promise<Book | undefined> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/books/${bookId}`, Security.requestOptions({}));
    const response = await res.json() as ResponseData<Book>;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when fetching book data.')
    }

    return response.Data;
}

export const save = async (book: Book): Promise<number> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/books/save`, Security.requestOptions(book));
    const response = await res.json() as ResponseData;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when saving book data.')
    }

    return book.id;
};

export const remove = async (book: { id: number; }): Promise<number> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/books/delete`, Security.requestOptions(book));
    const response = await res.json() as ResponseData;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when deleting book data.')
    }

    return book.id;
};

export const getAuthors = async (): Promise<Author[]> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/authors/all`, Security.requestOptions({}));
    const response = await res.json() as ResponseData<Author[]>;

    if (response.error) {
        throw new Error(response.message || 'An error occurred when fetching auhors data.')
    }

    return response.Data ?? [];
};
