<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="mt-3">
                    All users
                </h1>
            </div>

            <hr />

            <table v-if="ready" class="table table-compact table-striped">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Active</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="u in users" v-bind:key="u.id">
                        <td>
                            <router-link :to="`/admin/users/${u.id}`">{{ u.last_name }}, {{ u.first_name }}
                            </router-link>
                        </td>
                        <td>
                            {{ u.email }}
                        </td>
                        <td v-if="u.active">
                            <span class="badge bg-success">Active</span>
                        </td>
                        <td v-else>
                            <span class="badge bg-danger">Inactive</span>
                        </td>
                        <td v-if="(u.token?.id ?? -1) > 0">
                            <a href="javascript:void(0);">
                                <span class="badge bg-success" @click="logUserOut(u.id)">Logged in</span>
                            </a>
                        </td>
                        <td v-else>
                            <span class="badge bg-danger">Not logged in</span>
                        </td>
                    </tr>

                </tbody>
            </table>

            <p v-else>Loading...</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import notie from 'notie';
import { UserApi, UserModel } from '@/api';
import Security from '../security';
import { store } from '../store';

interface Data {
    users: UserModel.User[];
    ready: boolean;
}

export default defineComponent({
    data(): Data {
        return {
            users: [],
            ready: false
        }
    },
    emits: ['displayError', 'displaySuccess', 'forceUpdate'],
    methods: {
        logUserOut(id: number) {
            if (id !== store.user?.id) {
                notie.confirm({
                    text: 'Are you sure you want to log this user out?',
                    submitText: 'Log out',
                    submitCallback: () => {
                        UserApi.logUserOut(id)
                            .then((message) => {
                                this.$emit('displaySuccess', message);
                                this.$emit('forceUpdate');
                            })
                            .catch((err) => {
                                this.$emit('displayError', err);
                            })
                    }
                })
            } else {
                this.$emit('displayError', "You can't log yourself out.");
            }
        }
    },
    beforeMount() {
        const requireToken = Security.requireToken();

        if (requireToken) {
            return;
        }

        UserApi.getAll()
            .then((users) => {
                this.users = users;
                this.ready = true;
            })
            .catch((err) => {
                this.$emit('displayError', err);
            })
    }
});
</script>
