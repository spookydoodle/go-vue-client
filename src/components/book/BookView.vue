<template>
    <div class="container">
        <div class="row">
            <div class="col-md-2">
                <img v-if="!!book" class="img-fluid img-thumbnail" :src="`${imgPath}/covers/${book.slug}.jpg`"
                    alt="cover">
            </div>
            <div class="col-md-10">
                <template v-if="!!book">
                    <h3 class="mt-3">{{ book.title }}</h3>
                    <hr />
                    <p>
                        <strong>Author:</strong> {{ book.author?.author_name ?? '-' }}<br />
                        <strong>Published:</strong> {{ book.publication_year }}<br />
                    </p>
                    <p>
                        {{ book.description }}
                    </p>
                </template>
                <p v-else>Loading...</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Book } from '@/api/book/model';
import { defineComponent } from 'vue';
import * as BookApi from '../../api/book/api';

interface Data {
    book: Book | null;
    imgPath: string;
}

export default defineComponent({
    name: 'BookView', // required for keep-alive with specific component to work
    setup() {

    },
    data(): Data {
        return {
            book: null,
            imgPath: process.env.VUE_APP_IMAGE_URL
        }
    },
    // Move logic to activated when keep-alive is on because component is cached, so on mount happens only the first time the ocmponent is viewed (see App keep-alive)
    activated() {

    },
    mounted() {
        let { bookName } = this.$route.params;
        bookName = typeof bookName === 'string' ? bookName : bookName[0];

        BookApi.getOne(bookName)
            .then((book) => {
                this.book = book ?? null;
            })
            .catch((err: string) => {
                this.$emit('displayError', err || 'Unknown error when fetching book data.');
                this.book = null;
            });
    }
})
</script>