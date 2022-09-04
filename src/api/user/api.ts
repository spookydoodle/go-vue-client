import Security from "@/components/security";
import { ResponseData } from "../model";
import { User } from "./model";

export const logIn = async (user: { email: string; password: string }): Promise<User | undefined> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/users/login`, Security.requestOptions(user));
    const response = await res.json() as ResponseData<User>;

    if (response.error) {
        throw new Error(response.message || 'Error when logging in.')
    }

    return response.Data;
};

export const logOut = async (user: { token: string }): Promise<void> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/users/logout`, Security.requestOptions(user));
    const response = await res.json() as ResponseData;

    if (response.error) {
        throw new Error(response.message || 'Error when logging out.')
    }
};

export const getAll = async (): Promise<User[]> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/users`, Security.requestOptions({}));
    const response = await res.json() as ResponseData<{ users: User[] }>;

    if (response.error) {
        throw new Error(response.message || 'Error when logging out.')
    }

    return response.Data?.users ?? [];
};

export const getOne = async (userId: number): Promise<User | undefined> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/users/get/${userId}`, Security.requestOptions({}));

    if (!res.ok) {
        const errorResponse = await res.json() as { message?: string; cause?: string };
        throw new Error(errorResponse.message || errorResponse.cause || 'Error when fetching user data.')
    }

    const response = await res.json() as User;

    return response;
};

export const save = async (user: User): Promise<void> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/users/save`, Security.requestOptions(user));
    const response = await res.json() as ResponseData<User>;

    if (response.error) {
        throw new Error(response.message || 'Error when saving user.')
    }
};

export const remove = async (user: { id: number }): Promise<void> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/users/delete`, Security.requestOptions(user));
    const response = await res.json() as ResponseData;

    if (response.error) {
        throw new Error(response.message || 'Error when deleting user.')
    }
};

export const validateToken = async (requestOptions?: RequestInit): Promise<boolean> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/validate-token`, requestOptions);
    const response = await res.json() as ResponseData<boolean>;

    if (response.error) {
        throw new Error(response.message || 'Error when validating token.')
    }

    return !!response.Data;
};

export const logUserOut = async (userId: number): Promise<string> => {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/admin/log-user-out/${userId}`, Security.requestOptions({}));
    const response = await res.json() as ResponseData;

    if (response.error) {
        throw new Error(response.message || 'Error when logging user out.')
    }

    return response.message ?? 'Successfully logged user out.';
};
