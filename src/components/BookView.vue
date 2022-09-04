<template>
    <div class="container">
        <div class="row">
            <div class="col-md-2">
                <img v-if="this.ready" class="img-fluid img-thumbnail" :src="`${imgPath}/covers/${book.slug}.jpg`"
                    alt="cover">
            </div>
            <div class="col-md-10">
                <template v-if="this.ready">
                    <h3 class="mt-3">{{  book.title  }}</h3>
                    <hr />
                    <p>
                        <strong>Author:</strong> {{  book.author.author_name  }}<br />
                        <strong>Published:</strong> {{  book.publication_year  }}<br />
                    </p>
                    <p>
                        {{  book.description  }}
                    </p>
                </template>
                <p v-else>Loading...</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BookView', // required for keep-alive with specific component to work
    setup() {

    },
    data() {
        return {
            book: {},
            imgPath: process.env.VUE_APP_IMAGE_URL,
            ready: false
        }
    },
    // Move logic to activated when keep-alive is on because component is cached, so on mount happens only the first time the ocmponent is viewed (see App keep-alive)
    activated() {

    },
    mounted() {
        fetch(`${process.env.VUE_APP_API_URL}/books/${this.$route.params.bookName}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.message);
                }

                this.book = data.Data;
                this.ready = true;
            })
            .catch((err) => {
                this.$emit('error', err);
            });
    }
}
</script>