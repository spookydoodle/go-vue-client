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
                    <div class="mb-3" v-if="!!this.book.slug">
                        <img :src="`${this.imgPath}/covers/${this.book.slug}.jpg`"
                            class="img-fluid img-thumbnail book-cover" alt="cover" />
                    </div>

                    <div class="mb-3">
                        <label for="formFile" class="form-label">Cover Image</label>
                        <input v-if="this.book.id === 0" ref="coverInput" class="form-control" type="file" id="formFile"
                            required accept="image/jpeg" @change="loadCoverImage" />
                        <input v-else ref="coverInput" class="form-control" type="file" id="formFile"
                            accept="image/jpeg" @change="loadCoverImage" />
                    </div>

                    <text-input v-model="book.title" type="text" required="true" label="Title" :value="book.title"
                        name="title" />
                    <select-input name="author-id" v-model="this.book.author_id" :items="this.authors"
                        required="required" label="Author" />
                    <text-input v-model="book.publication_year" type="number" required="true" label="Publication Year"
                        :value="book.publication_year" name="publication-year" />

                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea v-model="book.description" required="true" name="description" class="form-control"
                            id="description" rows="3" />
                    </div>

                    <div class="mb-3">
                        <label for="genres" class="form-label">Genres</label>
                        <select ref="genres" id="genres" required="true" size="7" v-model="this.book.genre_ids" multiple
                            class="form-select">
                            <option v-for="g in this.genres" :value="g.value" :key="g.value">{{ g.text }}</option>
                        </select>
                    </div>

                    <hr />

                    <div class="float-start">
                        <input type="submit" class="btn btn-primary me-2" value="Save" />
                        <router-link to="/admin/books" class="btn btn-outline-secondary">Cancel</router-link>
                    </div>

                    <div class="float-end">
                        <a v-if="this.book.id > 0" class="btn btn-danger" href="javascript:void(0);"
                            @click="confirmDelete(this.book.id)">
                            Delete
                        </a>
                    </div>

                    <div class="clearfix"></div>
                </form-tag>
            </div>
        </div>
    </div>
</template>

<script>
import notie from 'notie';
import Security from './security';
import SelectInput from './forms/SelectInput.vue';
import FormTag from './forms/FormTag.vue'
import TextInput from './forms/TextInput.vue'
import router from '@/router';

export default {
    name: "BookEdit",
    components: {
        'form-tag': FormTag,
        'text-input': TextInput,
        'select-input': SelectInput
    },
    data() {
        return {
            book: {
                id: 0,
                title: '',
                author_id: 0,
                publication_year: null,
                description: '',
                cover: '',
                slug: '',
                genres: [],
                genre_ids: []
            },
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
            const payload = {
                id: this.book.id,
                title: this.book.title,
                author_id: parseInt(this.book.author_id, 10),
                publication_year: parseInt(this.book.publication_year, 10),
                description: this.book.description,
                cover: this.book.cover,
                slug: this.book.slug,
                genre_ids: this.book.genre_ids
            };

            fetch(`${process.env.VUE_APP_API_URL}/admin/books/save`, Security.requestOptions(payload))
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.message);
                    }

                    this.$emit('success', 'Changes saved');
                    router.push('/admin/books');
                })
                .catch((err) => {
                    this.$emit('error', err);
                });
        },
        loadCoverImage() {
            const file = this.$refs.coverInput.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result
                    .replace('data:', "")
                    .replace(/^.+,/, "");

                this.book.cover = base64String;
                alert(base64String);
            }

            reader.readAsDataURL(file);
        },
        confirmDelete(id) {
            notie.confirm({
                text: 'Are you sure you want to delete this book?',
                submitText: 'Delete',
                submitCallback: () => {
                    const payload = {
                        id: id,
                    }

                    fetch(`${process.env.VUE_APP_API_URL}/admin/books/delete`, Security.requestOptions(payload))
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.error) {
                                throw new Error(data.message);
                            }

                            this.$emit('success', 'Book deleted');
                            router.push('/admin/books');
                        })
                        .catch((err) => {
                            this.$emit('error', err);
                        });
                }
            })
        }
    },
    beforeMount() {
        Security.requireToken();

        if (this.$route.params.bookId > 0) {
            fetch(`${process.env.VUE_APP_API_URL}/admin/books/${this.$route.params.bookId}`, Security.requestOptions(""))
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.message)
                    }

                    this.book = data.Data;
                    console.log(this.book);
                    this.book.genre_ids = this.book.genres?.map((g) => g.id) ?? [];
                })
                .catch((err) => {
                    this.$emit('error', err);
                });
        } else {
            //
        }

        fetch(`${process.env.VUE_APP_API_URL}/admin/authors/all`, Security.requestOptions(""))
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.message);
                }

                this.authors = data.Data
            })
            .catch((err) => {
                this.$emit('error', err);
            });
    },
}
</script>