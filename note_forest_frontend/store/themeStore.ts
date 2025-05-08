import {defineStore} from "pinia";
import {useTheme} from "vuetify";

const useThemeStore = defineStore("themeStore", () => {
    const isMenuDisplay = ref<boolean>(false)
    const isDarkModeEnabled = ref<boolean>(false)
    const lang = ref<string>('cn')

    const toggleMenuDisplay = () => isMenuDisplay.value = !isMenuDisplay.value
    const toggleDarkMode = () => {
        isDarkModeEnabled.value = !isDarkModeEnabled.value
    }


    return {
        isMenuDisplay,
        isDarkModeEnabled,
        toggleMenuDisplay,
        toggleDarkMode,
        lang

    }
})

export default useThemeStore