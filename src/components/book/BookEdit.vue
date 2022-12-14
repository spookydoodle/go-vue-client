<style scoped>
.book-cover {
    max-width: 10em;
}
</style>

<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-3">
                    Add/Edit Book
                </h1>

                <hr />

                <form-tag @bookEditEvent="submitHandler" name="bookForm" event="bookEditEvent">
                    <div class="mb-3" v-if="!!book.slug">
                        <img :src="`${imgPath}/covers/${book.slug}.jpg`" class="img-fluid img-thumbnail book-cover"
                            alt="cover" />
                    </div>

                    <div class="mb-3">
                        <label for="formFile" class="form-label">Cover Image</label>
                        <input v-if="book.id === 0" ref="coverInput" class="form-control" type="file" id="formFile"
                            required accept="image/jpeg" @change="loadCoverImage" />
                        <input v-else ref="coverInput" class="form-control" type="file" id="formFile"
                            accept="image/jpeg" @change="loadCoverImage" />
                    </div>

                    <text-input v-model="book.title" type="text" required label="Title" :value="book.title"
                        name="title" />
                    <select-input name="author-id" v-model="book.author_id" :items="authors" required="required"
                        label="Author" />
                    <text-input type="number" v-model="book.publication_year" required label="Publication Year"
                        :value="book.publication_year" name="publication-year" />

                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea v-model="book.description" required name="description" class="form-control"
                            id="description" rows="3" />
                    </div>

                    <div class="mb-3">
                        <label for="genres" class="form-label">Genres</label>
                        <select ref="genres" id="genres" required size="7" v-model="book.genre_ids" multiple
                            class="form-select">
                            <option v-for="g in genres" :value="g.value" :key="g.value">{{ g.text }}</option>
                        </select>
                    </div>

                    <hr />

                    <div class="float-start">
                        <input type="submit" class="btn btn-primary me-2" value="Save" />
                        <router-link to="/admin/books" class="btn btn-outline-secondary">Cancel</router-link>
                    </div>

                    <div class="float-end">
                        <a v-if="book.id > 0" class="btn btn-danger" href="javascript:void(0);"
                            @click="confirmDelete(book.id)">
                            Delete
                        </a>
                    </div>

                    <div class="clearfix"></div>
                </form-tag>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import notie from 'notie';
import Security from '../security';
import SelectInput from '../forms/SelectInput.vue';
import FormTag from '../forms/FormTag.vue';
import TextInput from '../forms/TextInput.vue';
import router from '@/router';
import { Book, Author, Genre} from '../../api/book/model';
import * as BookApi from '../../api/book/api';

interface Data {
    book: Book;
    authors: Author[];
    imgPath: string;
    genres: {
    value: number;
    text: string;
}[];
}

const defaultBook: Book = {
    id: 0,
    title: '',
    author_id: 0,
    publication_year: undefined,
    description: '',
    cover: '',
    slug: '',
    genre_ids: []
};

export default defineComponent({
    name: "BookEdit",
    components: {
        'form-tag': FormTag,
        'text-input': TextInput,
        'select-input': SelectInput
    },
    data(): Data {
        return {
            book: defaultBook,
            authors: [],
            imgPath: process.env.VUE_APP_IMAGE_URL,
            genres: [
                { value: 1, text: "Science Fiction" },
                { value: 2, text: "Fantasy" },
                { value: 3, text: "Romance" },
                { value: 4, text: "Thriller" },
                { value: 5, text: "Mystery" },
                { value: 6, text: "Horror" },
                { value: 7, text: "Classic" },
            ]
        }
    },
    methods: {
        submitHandler() {
            const book: Book = {
                id: this.book.id,
                title: this.book.title,
                author_id: typeof this.book.author_id === 'string' ? parseInt(this.book.author_id, 10) : this.book.author_id,
                publication_year: typeof this.book.publication_year === 'string' ? parseInt(this.book.publication_year, 10) : this.book.publication_year,
                description: this.book.description,
                cover: this.book.cover,
                slug: this.book.slug,
                genre_ids: this.book.genre_ids
            };

            BookApi.save(book)
                .then(() => {
                    this.$emit('displaySuccess', 'Changes saved');
                    router.push('/admin/books');
                })
                .catch((err: string) => {
                    this.$emit('displayError', err);
                });
        },
        loadCoverImage() {
            const file = (this.$refs.coverInput as HTMLInputElement).files?.[0];
            
            if (!file) { 
                return;
            }

            const reader = new FileReader();

            reader.onloadend = (): void => {
                if (!reader.result) {
                    this.book.cover = '';
                    
                    return;
                }

                const base64String = (typeof reader.result === 'string' ? reader.result : undefined)
                    ?.replace('data:', "")
                    .replace(/^.+,/, "");

                this.book.cover = base64String ?? '';
                alert(base64String);
            }

            reader.readAsDataURL(file);
        },
        confirmDelete(id: number) {
            notie.confirm({
                text: 'Are you sure you want to delete this book?',
                submitText: 'Delete',
                submitCallback: (): void => {
                    BookApi.remove({ id })
                        .then(() => {
                            this.$emit('displaySuccess', 'Book deleted');
                            router.push('/admin/books');
                        })
                        .catch((err: string) => {
                            this.$emit('displayError', err || 'Unknown error when deleting book.');
                        });
                }
            })
        }
    },
    beforeMount() {
        const requireToken = Security.requireToken();

        if (requireToken) {
            return;
        }

        let { bookId } = this.$route.params;
        bookId = typeof bookId === 'string' ? bookId : bookId[0];

        if (parseInt(bookId, 10) > 0) {
            let {bookId} = this.$route.params;
            bookId = typeof bookId === 'string' ? bookId : bookId[0];

            BookApi.getOneAdmin(parseInt(bookId, 10))
                .then((book: Book | undefined) => {
                    this.book = book ?? defaultBook;
                    this.book.genre_ids = this.book.genres?.map((genre: Genre) => genre.id) ?? [];
                })
                .catch((err: string) => {
                    this.$emit('displayError', err || 'Unknown error when fetching book data.');
                });
        } else {
            //
        }

        BookApi.getAuthors()
            .then((authors) => {
                this.authors = authors
            })
            .catch((err: string) => {
                this.$emit('displayError', err || 'Unknown error when fetching auhors data.');
            });
    },
});
</script>