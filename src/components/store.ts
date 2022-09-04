import { reactive } from 'vue';
import { UserModel } from '@/api';

export interface Store {
    token: string;
    user: UserModel.User | null;
}

export const store: Store = reactive({
    token: '',
    user: null
});
