<script>
// import { defineComponent } from '@vue/composition-api';
import FormTag from './forms/FormTag.vue'
import TextInput from './forms/TextInput.vue'
// import SelectInput from './forms/SelectInput.vue'
// import CheckBox from './forms/CheckBox.vue'
import { store } from './store';
import router from '../router/index';
import Security from './security';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LogIn',
    components: {
        FormTag,
        TextInput,
        // SelectInput,
        // CheckBox
    },
    data() {
        return {
            email: "",
            password: "",
            store
        }
    },
    methods: {
        submitHandler() {
            const payload = {
                email: this.email,
                password: this.password
            };

            fetch(`${process.env.VUE_APP_API_URL}/users/login`, Security.requestOptions(payload))
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.message);
                    }

                    store.token = data.Data.token.token;
                    store.user = {
                        id: data.Data.user.id,
                        first_name: data.Data.user.first_name,
                        last_name: data.Data.user.last_name,
                        email: data.Data.user.email,
                    }

                    const date = new Date();
                    let expiryDays = 1;
                    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);

                    const expires = `expires=${date.toUTCString()}`;

                    document.cookie = `_site_data=${JSON.stringify(data.Data)}; Expires=${expires}; Path=/; SameSite=strict; Secure=; `;

                    router.push('/');
                })
                .catch((err) => {
                    this.$emit('displayError', err);
                });
        },
    },
});
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-5">Login</h1>
                <hr>
                <!-- v-on:myevent="submitHandler" = @myevent="submitHandler" -->
                <form-tag @myevent="submitHandler" name="login" event="myevent" method="post" action="/login">
                    <text-input v-model="email" label="Email" type="email" name="email" required="true" />
                    <text-input v-model="password" label="Password" type="password" name="password" required="true" />
                    <hr />
                    E-mail: {{email}}
                    <hr />
                    <input type="submit" class="btn btn-primary" value="Login">
                </form-tag>
            </div>
        </div>
    </div>
</template>