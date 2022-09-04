import { createRouter, createWebHistory } from 'vue-router';
import LayoutBody from '@/components/LayoutBody.vue';
import LogIn from '@/components/LogIn.vue';
import BooksAdmin from '@/components/BooksAdmin.vue';
import BooksView from '@/components/BooksView.vue';
import BookView from '@/components/BookView.vue';
import BookEdit from '@/components/BookEdit.vue';
import UsersAll from '@/components/UsersAll.vue';
import UserEdit from '@/components/UserEdit.vue';
import Security from '../components/security';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LayoutBody
    },
    {
        path: '/login',
        name: 'Login',
        component: LogIn
    },
    {
        path: '/books',
        name: 'BooksView',
        component: BooksView
    },
    {
        path: '/books/:bookName',
        name: 'BookView',
        component: BookView
    },
    {
        path: '/admin/books',
        name: 'Books Admin',
        component: BooksAdmin
    },
    {
        path: '/admin/books/:bookId',
        name: 'Book Edit',
        component: BookEdit
    },
    {
        path: '/admin/users',
        name: 'Users',
        component: UsersAll
    },
    {
        path: '/admin/users/:userId',
        name: 'User Edit',
        component: UserEdit
    },
];

const router = createRouter({ history: createWebHistory() , routes });

router.beforeEach(() => {
    Security.checkToken();
});

export default router;
