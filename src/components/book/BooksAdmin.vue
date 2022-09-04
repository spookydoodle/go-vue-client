<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-3">
                    Manage Books
                </h1>

                <hr />

                <table v-if="this.ready" class="table table-striped table-compact">
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in this.books" v-bind:key="b.id">
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

<script>
import Security from '../security';

export default {
    name: 'BooksAdmin', // required for keep-alive with specific component to work
    data() {
        return {
            books: {},
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

        fetch(`${process.env.VUE_APP_API_URL}/books`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.message)
                }

                this.books = data.Data.books;
                this.ready = true;
            })
            .catch((err) => {
                this.$emit('displayError', err);
            });
    }
}
</script>