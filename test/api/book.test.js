import { describe, expect, test } from '@jest/globals';
import * as BookApi from '../../src/api/book';
import * as testData from './testData';

describe('Book API', () => {
    test('should get all books', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(testData.mockAllBooksResponse),
            })
        );

        BookApi.getAllBooks()
            .then((books) => {
                expect(books[0].title).toBe(testData.mockAllBooksResponse.Data.books[0].title);
                expect(books.length).toBe(testData.mockAllBooksResponse.Data.books.length);
            })
            .catch((err) => {
                console.log(err);
                expect(true).toBe(false);
            });
    });
})
