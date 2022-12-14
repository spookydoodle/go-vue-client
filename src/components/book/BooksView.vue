<style scoped>
.filter {
    padding: 6px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.35s;
    border: 1px solid silver;
    box-sizing: border-box;
}

.filter:hover {
    background: lightgrey;
}

.filter:active {
    background: lightgreen;
}

.book-author,
.book-genre {
    font-size: 0.8em;
}

.books-move {
    transition: all .5s ease-in-out 50ms;
}

.books-enter-active {
    transition: all .5s ease-in-out;
}

.books-leave-active {
    transition: all .5s ease-in;
}

.books-enter,
.books-leave {
    opacity: 0;
}
</style>


<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-3">
                    Books View
                </h1>
            </div>

            <hr>

            <div class="filters text-center mb-3">
                <span class="filter me-1" v-bind:class="{ active: currentFilter === 0 }"
                    v-on:click="() => setFilter(0)">ALL</span>
                <span class="filter me-1" v-bind:class="{ active: currentFilter === 7 }"
                    v-on:click="() => setFilter(7)">CLASSIC</span>
                <span class="filter me-1" v-bind:class="{ active: currentFilter === 2 }"
                    v-on:click="() => setFilter(2)">FANTASY</span>
                <span class="filter me-1" v-bind:class="{ active: currentFilter === 6 }"
                    v-on:click="() => setFilter(6)">HORROR</span>
                <span class="filter me-1" v-bind:class="{ active: currentFilter === 4 }"
                    v-on:click="() => setFilter(4)">THRILLER</span>
                <span class="filter me-1" v-bind:class="{ active: currentFilter === 1 }"
                    v-on:click="() => setFilter(1)">SCIENCE FICTION</span>
            </div>

            <hr>

            <div>
                <div class="carg-group">

                    <transition-group class="p-3 d-flex flex-wrap" tag="div" appear name="books">

                        <div v-for="b in books" :key="b.id">
                            <div class="card me-2 ms-1 mb-3" style="width: 10rem;"
                                v-if="b.genre_ids.includes(currentFilter) || currentFilter === 0">
                                <router-link :to="`/books/${b.slug}`">
                                    <img :src="`${imgPath}/covers/${b.slug}.jpg`" alt="`Cover for ${b.title}`"
                                        class="card-img-top" />
                                </router-link>
                                <div class="card-body text-center">
                                    <h6 class="card-title">{{ b.title }}</h6>
                                    <span class="book-author">{{ b.author?.author_name ?? '-' }}</span><br />
                                    <small class="text-muted book-genre" v-for="(g, index) in b.genres"
                                        v-bind:key="g.id">
                                        <em class="me-1">{{ g.genre_name }}
                                            <template v-if="index !== ((b.genres?.length ?? 0) - 1)">,</template>
                                        </em>
                                    </small>
                                </div>
                            </div>
                        </div>

                    </transition-group>

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Book } from '@/api/book/model';
import { store, Store } from '@/components/store';
import * as BookApi from '../../api/book/api';

interface Data {
    store: Store;
    ready: boolean;
    imgPath: string;
    books: Book[];
    currentFilter: number;
}

export default defineComponent({
    name: 'BooksView',
    data(): Data {
        return {
            store: store,
            ready: false,
            imgPath: process.env.VUE_APP_IMAGE_URL,
            books: [],
            currentFilter: 0,
        }
    },
    methods: {
        setFilter: function (filter: number) {
            this.currentFilter = filter;
        },
    },
    emits: ['displayError'],
    beforeMount() {
        BookApi.getAll()
            .then((books) => {
                this.books = books;
                this.ready = true;
            })
            .catch((err: string) => {
                this.$emit('displayError', err || 'Unknown error when fetching books data.');
            });
    }
})
</script>