import { reactive } from 'vue';

export interface Store {
    token: string;
    user: User | null;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export const store: Store = reactive({
    token: '',
    user: null
});
