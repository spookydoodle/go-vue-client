import { createRouter, createWebHistory } from 'vue-router';
import LayoutBody from '../components/LayoutBody';
import LogIn from '../components/LogIn';
import BooksAdmin from '../components/BooksAdmin';
import BooksView from '../components/BooksView';
import BookView from '../components/BookView';
import BookEdit from '../components/BookEdit';
import UsersAll from '../components/UsersAll';
import UserEdit from '../components/UserEdit';
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
