/**
 * @param active 1 - active, 0 - inactive
 */
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    active?: number;
    token?: {
        id: number;
        token: string;
    }
}
