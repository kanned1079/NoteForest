// // composables/useInitTheme.ts
// import useThemeStore from "~/store/themeStore";
// import {useTheme} from "vuetify/framework";
//
// export function useInitTheme(): {prefersDark: boolean} {
//     const sysTheme = useTheme()
//     const themeStore = useThemeStore()
//
//     let prefersDark = false
//     // if (process.client) {
//     if (import.meta.client) {
//         prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//         themeStore.isDarkModeEnabled = prefersDark
//         sysTheme.global.name.value = prefersDark ? 'dark' : 'light'
//     }
//
//     return {prefersDark}
// }

// composables/useInitTheme.ts
import useThemeStore from '~/store/themeStore'
import { useTheme } from 'vuetify/framework'

export function useInitTheme(): () => void {
    const themeStore = useThemeStore()
    const sysTheme = useTheme()

    if (!import.meta.client) return () => {}

    const getPreferredDark = (): boolean => {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark') return true
        if (saved === 'light') return false
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    const applyTheme = (isDark: boolean) => {
        themeStore.isDarkModeEnabled = isDark
        sysTheme.global.name.value = isDark ? 'dark' : 'light'

        document.documentElement.classList.toggle('dark', isDark) // ✅ Tailwind or other class-based theme libs
    }

    // 初始化
    const isDark = getPreferredDark()
    applyTheme(isDark)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
        const saved = localStorage.getItem('theme')
        if (!saved) {
            applyTheme(e.matches)
        }
    }

    mediaQuery.addEventListener('change', onChange)

    // 返回清理函数（可在 onBeforeUnmount 调用）
    return () => {
        mediaQuery.removeEventListener('change', onChange)
    }
}