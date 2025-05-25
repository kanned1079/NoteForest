import {useCommonFetch} from "~/composables/useCommonFetch";
import type {User} from "~/types/user";
import {da} from "vuetify/locale";
import useUserStore from "~/store/userStore";
import type {UniversalApiResponse} from "~/types/res";
import userStore from "~/store/userStore";

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

type UpdateUsernameRespData = {
    username: string
}

export const updateUsername = async (newUsername: string): {code: number} => {
    const userStore = useUserStore()
    const {code, data, error} = await useCommonFetch<UpdateUsernameRespData>(`/api/v1/user/username/update/${userStore.user.id}`, {
        method: 'PATCH',
        auth: true,
        body: {
            username: newUsername
        }
    })
    if (!error && code === 200 && data) {
        userStore.user.username = data.username
        return {code: 200}
    } else {
        return {code: code}
    }
}

export const updateUserPasswordById = async (previousPwd: string, newPwd: string): {code: number} => {
    const userStore = useUserStore()
    const {code, data, error} = await useCommonFetch<UpdateUsernameRespData>(`/api/v1/user/password/update/${userStore.user.id}`, {
        method: 'PATCH',
        auth: true,
        body: {
            previousPassword: previousPwd,
            newPassword: newPwd
        }
    })
    if (!error && code === 200 && data) {
        return {code: 200}
    } else {
        return {code: code}
    }
}

// export const newUserRegister = async (email: string, password: string): {code: number} => {
//
// }