<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-3">
                    Manage Books
                </h1>

                <hr />

                <table v-if="ready" class="table table-striped table-compact">
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in books" v-bind:key="b.id">
                            <td>
                                <router-link :to="`/admin/books/${b.id}`">{{ b.title }}</router-link>
                            </td>
                            <td>
                                {{ b.author.author_name }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Security from '../security';
import { Book } from '../../api/model';
import * as BookApi from '../../api/book';

interface Data {
    books: Book[];
    ready: Boolean;
}

export default defineComponent({
    name: 'BooksAdmin', // required for keep-alive with specific component to work
    data(): Data {
        return {
            books: [],
            ready: false
        }
    },
    beforeMount() {
    },
    mounted() {
        const requireToken = Security.requireToken();

        if (requireToken) {
            return;
        }

        BookApi.getAllBooks()
            .then((books) => {
                this.books = books;
                this.ready = true;
            })
            .catch((err: string) => {
                this.$emit('displayError', err || 'Unknown error when fetching books data.');
            });
    }
});
</script>