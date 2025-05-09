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

export const userLogin = async (email: string, password: string): { code: number } => {
    const userStore = useUserStore()
    const {data, error} = await useCommonFetch<{ data: UniversalApiResponse<User> }>('/api/v1/user/login', {
        method: 'POST',
        auth: false,
        body: {
            email, password
        }
    })
    if (!error) {
        if (data.data) {
            let _data: UniversalApiResponse<User> = data?.data
            if (_data.code === 200) {
                Object.assign(userStore.user, _data.user)
                userStore.isAuthed = true
                const token = useCookie('token')
                token.value = _data.user.token
            }
            return _data.code
        }
    }
}