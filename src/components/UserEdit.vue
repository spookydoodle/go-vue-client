<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-3">
                    Edit user
                </h1>

                <hr />

                <form-tag v-if="ready" @userEditEvent="submitHandler" name="userform" event="userEditEvent">
                    <text-input v-model="user.first_name" type="text" required label="First Name"
                        :value="user.first_name" name="first-name" />
                    <text-input v-model="user.last_name" type="text" required label="Last Name"
                        :value="user.last_name" name="last-name" />
                    <text-input v-model="user.email" type="text" required label="E-mail" :value="user.email"
                        name="email" />
                    <text-input v-if="user.id === 0" v-model="user.password" type="password" required
                        label="Password" :value="user.email" name="password" />
                    <text-input v-else v-model="user.password" type="password" label="Password" :value="user.email"
                        name="password" help="Leave empty to keep existing password" />

                    <div class="form-check">
                        <input v-model="user.active" class="form-check-input" type="radio" id="user-active"
                            :value="1" />
                        <label for="user-active-2" class="form-check-label">
                            Active
                        </label>
                    </div>
                    <div class="form-check">
                        <input v-model="user.active" class="form-check-input" type="radio" id="user-active-2"
                            :value="0" />
                        <label for="user-active" class="form-check-label">
                            Inactive
                        </label>
                    </div>
                    <hr />

                    <div class="float-start">
                        <input type="submit" class="btn btn-primary me-2" value="Save" />
                        <router-link to="/admin/users" class="btn btn-outline-secondary">Cancel</router-link>
                    </div>

                    <div class="float-end">
                        <a v-if="!!user && userIdParam > 0 && userIdParam !== store.user?.id"
                            class="btn btn-danger" href="javascript:void(0);"
                            @click="confirmDelete(userIdParam)">Delete</a>
                    </div>

                    <div class="clearfix">

                    </div>
                </form-tag>

                <p v-else>Loading...</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import notie from 'notie';
import Security from './security';
import router from '../router';
import FormTag from './forms/FormTag.vue'
import TextInput from './forms/TextInput.vue'
import { Store, store } from './store';
import { UserApi, UserModel } from '@/api';

interface Data {
    user: UserModel.User;
    store: Store;
    ready: boolean;
}

const defaultUser: UserModel.User = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    active: 0,
    password: '',
    token: { 
        token: '',
        id: -1
    }
};

export default defineComponent({
    data(): Data {
        return {
            user: defaultUser,
            store,
            ready: false,
        }
    },
    computed: {
        userIdParam() {
            let { userId } = this.$route.params;
            userId = typeof userId === 'string' ? userId : userId[0];

            return parseInt(userId, 10)
        }
    },
    components: {
        'form-tag': FormTag,
        'text-input': TextInput,
    },
    emits: ['displayError', 'displaySuccess'],
    methods: {
        submitHandler() {
            if (!this.user) {
                return;
            }

            const user: UserModel.User = {
                id: parseInt(String(this.$route.params.userId), 10),
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                email: this.user.email,
                password: this.user.password,
                active: this.user.active
            };

            UserApi.save(user)
                .then(() => {
                    this.$emit('displaySuccess', 'Changes saved');
                    router.push('/admin/users');
                })
                .catch((err) => {
                    this.$emit('displayError', err);
                });
        },
        confirmDelete(id: number) {
            notie.confirm({
                text: 'Are you sure you want to delete this user?',
                submitText: 'Delete',
                submitCallback: () => {
                    UserApi.remove({ id })
                        .then(() => {
                            this.$emit('displaySuccess', 'User deleted');
                            router.push('/admin/users');
                        })
                        .catch((err) => {
                            this.$emit('displayError', err);
                        })
                }
            })
        },
    },
    beforeMount() {
        const requireToken = Security.requireToken();

        if (requireToken) {
            return;
        }

        if (this.userIdParam > 0) {
            UserApi.getOne(this.userIdParam)
                .then((u) => {
                    console.log(u, u ? { ...u, password: '' } : defaultUser);
                    this.user = u ? { ...u, password: '' } : defaultUser;
                    this.ready = true;
                })
                .catch((err) => {
                    this.$emit('displayError', err);
                })
        } else {
            this.user = defaultUser;
            this.ready = true;
        }
    },
});
</script>
