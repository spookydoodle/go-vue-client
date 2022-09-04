import { store } from "./store";
import router from '../router';
import { UserApi } from "@/api";

export type Payload = { [key in string]?: string | number | string[] | number[] | null | Payload | any };

const Security = {
    requireToken: (): boolean => {
        if (store.token === '') {
            router.push('/login');

            return true;
        }

        return false;
    },
    requestOptions: (payload: Payload) => {
        const headers = new Headers();

        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${store.token}`);

        return {
            method: "POST",
            body: JSON.stringify(payload),
            headers: headers
        }
    },
    checkToken: () => {
        if (store.token !== "") {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            UserApi.validateToken({
                method: "POST",
                body: JSON.stringify({ token: store.token }),
                headers: headers
            })
                .then((isValid) => {
                    if (isValid) {
                        return;
                    }

                    store.token = "";
                    store.user = null;
                    document.cookie = '_site_data=; Path=/; SameSite=strict; Secure; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
}

export default Security;
