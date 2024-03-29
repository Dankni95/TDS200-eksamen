import {Directus} from "@directus/sdk";
import {ICurrentUser} from '@/models/IAdvertisementResponse';


export const directus = new Directus("https://zguhw62p.directus.app/", {
    auth: {
        mode: "json",
    },
});


export const authService = {
    async login(email: string, password: string) {
        return await directus.auth.login({email, password});
    },
    async register(firstName: string, lastName: string, email: string, password: string): Promise<boolean> {
        const createUserResult = await directus.users.createOne({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            role: "8cd7bf01-a84c-4440-91db-e9fadd6bdc76"
        });

        return !!createUserResult?.email;
    },
    async logout() {
        return await directus.auth.logout();
    },
    async currentUser() {
        return await directus.users.me.read() as ICurrentUser;
    },
};
