// middleware/auth.global.ts
import useUserStore from '~/store/userStore'

export default defineNuxtRouteMiddleware((to) => {
    const userStore = useUserStore()

    const isAuthed = userStore.isAuthed && userStore.user?.id > 0
    const isAdmin = userStore.user?.role === 'admin'

    const path = to.path

    if (path.endsWith('/profile') && !isAuthed) {
        console.log('you are not authed.')
        // return navigateTo(`/${to.path.split('/')[1]}/`)
        return false
    }

    if (path.includes('/admin') && (!isAuthed || !isAdmin)) {
        console.log('sorry, you have no admin privilege.')
        // return navigateTo(`/${to.path.split('/')[1]}/`)
        return false
    }
})