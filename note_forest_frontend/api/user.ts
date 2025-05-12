import {useCommonFetch} from "~/composables/useCommonFetch";
import type {User} from "~/types/user";
import {da} from "vuetify/locale";
import useUserStore from "~/store/userStore";
import type {UniversalApiResponse} from "~/types/res";

// type UniversalApiResponse<T> = {
//     code: number,
//     message: string[],
//     user: T
// }

export const processUserAuth = async (email: string, password: string, type: 'login' | 'register'): { code: number } => {
    const userStore = useUserStore()
    const {code, data, error} = await useCommonFetch<User>(`/api/v1/user/${type}`, {
        method: 'POST',
        auth: false,
        body: {
            email, password
        }
    })
    if (!error && code === 200 && data) {
        Object.assign(userStore.user, data)
        userStore.isAuthed = true
        const token = useCookie('token')
        token.value = data.token
        return {code: 200}
    } else {
        return {code: code}
    }
}

export const newUserRegister = async (email: string, password: string): {code: number} => {

}