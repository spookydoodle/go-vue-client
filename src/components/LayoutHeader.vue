<script>
import { store } from './store';
import router from '../router/index';
import Security from './security';

export default {
    data() {
        return {
            store
        }
    },
    methods: {
        handleLogout() {
            const payload = {
                token: store.token
            }

            fetch(`${process.env.VUE_APP_API_URL}/users/logout`, Security.requestOptions(payload))
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error('Error when logging out');
                    }

                    store.token = '';
                    store.user = {};
                    document.cookie = '_site_data=; Path=/; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:01 GMT; '
                    router.push('/login');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <router-link class="nav-link active" aria-current="page" to="/">
                        Home
                    </router-link>
                </li>

                <li class="nav-item">
                    <router-link class="nav-link active" to="/books">
                        Books
                    </router-link>
                </li>

                <li v-if="store.token !== ''" class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navBarDropDown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Admin
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navBarDropDown">
                        <li>
                            <router-link class="dropdown-item" to="/admin/users">Manage Users</router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" to="/admin/users/0">Add User</router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" to="/admin/books">Manage Books</router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" :to="{ name: 'Book Edit', params: { bookId: 0 } }">Edit Book</router-link>
                        </li>
                    </ul>
                </li>

                <li class="nav-item">
                    <router-link v-if="store.token === ''" class="nav-link" aria-current="page" to="/login">
                        Login
                    </router-link>
                    <a href="javascript:void(0);" v-else class="nav-link" @click="handleLogout">Log out</a>
                </li>
            </ul>

            <span class="navbar-text">
            {{ store.user.first_name ?? '' }}
            </span>
        </div>
    </nav>
</template>
