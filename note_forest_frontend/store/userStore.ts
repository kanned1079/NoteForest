import {defineStore} from "pinia";
import type {User} from "~/types/user";
import {useI18n} from "vue-i18n";

const useUserStore = defineStore('userStore', () => {
    const isAuthed = ref<boolean>(true)
    const user = ref<User>({
        // id: 1,
        // email: 'kanned1079@icloud.com',
        // username: 'kanned1079',
        // role: 'admin'
        id: 0,
        email: '',
        username: '',
        role: 'user'
    })

    const clearUserData = () => {
        Object.assign(user.value, {
            id: 0,
            email: '',
            username: '',
        } as User)
        isAuthed.value = false
        const token = useCookie('token')
        token.value = null // 或 ''
    }

    const logout = () => {
        const {locale} = useI18n()
        clearUserData()
        navigateTo({path: `/${locale.value}/`})
    }

    return {
        user,
        isAuthed,
        clearUserData,
        logout
    }
}, {
    persist: true
})

export default useUserStore