import {defineStore} from "pinia";
import type {User} from "~/types/user";

const useUserStore = defineStore('userStore', () => {
    const isAuthed = ref<boolean>(true)
    const user = ref<User>({
        id: 1,
        email: 'kanned1079@icloud.com',
        username: 'kanned1079',
        role: 'admin'
    })

    const clearUserData = () => {
        Object.assign(user.value, {
            id: 0,
            email: '',
            username: '',
        } as User)
        isAuthed.value = false
    }

    return {
        user,
        isAuthed,
        clearUserData
    }
}, {
    persist: {
        storage: true
    }
})

export default useUserStore