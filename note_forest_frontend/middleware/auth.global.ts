// middleware/auth.global.ts
import useUserStore from '~/store/userStore'
import useThemeStore from "~/store/themeStore";

export default defineNuxtRouteMiddleware((to) => {
    const userStore = useUserStore()
    const themeStore = useThemeStore()

    const isAuthed = userStore.isAuthed && userStore.user.id
    const isAdmin = userStore.user?.role === 'admin'

    const path = to.path

    if (path.endsWith('/profile') && !isAuthed) {
        console.log('you are not authed.')
        themeStore.showMessage('你可能还没有登录账户', 'warning')

        // return navigateTo(`/${to.path.split('/')[1]}/`)
        return false
    }

    if (path.includes('/admin') && (!isAuthed || !isAdmin)) {
        console.log('sorry, you have no admin privilege.')
        // return navigateTo(`/${to.path.split('/')[1]}/`)
        return false
    }
})