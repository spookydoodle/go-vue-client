<script lang="ts">
import { defineComponent } from 'vue';
import FormTag from './forms/FormTag.vue'
import TextInput from './forms/TextInput.vue'
import { Store, store } from './store';
import router from '../router/index';
import { UserApi, UserModel } from '@/api';

interface Data {
    email: string;
    password: string;
    store: Store;
}

export default defineComponent({
    name: 'LogIn',
    components: {
        FormTag,
        TextInput
    },
    data(): Data {
        return {
            email: "",
            password: "",
            store
        }
    },
    methods: {
        submitHandler(): void {
            UserApi.logIn({ email: this.email, password: this.password })
                .then((user: UserModel.User | undefined) => {
                    if (!user) {
                        store.token = '';
                        store.user = null;
                        
                        return;
                    }

                    store.token = user.token?.token ?? '';
                    store.user = {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                    }

                    const date = new Date();
                    let expiryDays = 1;
                    date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);

                    document.cookie = `_site_data=${JSON.stringify(user)}; Expires=${date.toUTCString()}; Path=/; SameSite=strict; Secure=; `;

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