import { type ThemeDefinition } from "vuetify"

export const glacierBlueLight: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#f5f5f5',
        surface: '#ffffff',
        primary: '#6390b9',
        'primary-darken-1': '#50749a',
        secondary: '#90a4ae',
        'secondary-darken-1': '#708690',
        error: '#d32f2f',
        info: '#1976d2',
        success: '#388e3c',
        warning: '#fbc02d',
    },
}

export const glacierBlueNight: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#1e1e1e',
        surface: '#2c2c2c',
        primary: '#6390b9',
        'primary-darken-1': '#4f728f',
        secondary: '#90a4ae',
        'secondary-darken-1': '#708690',
        error: '#cf6679',
        info: '#90caf9',
        success: '#81c784',
        warning: '#ffb74d',
    },
}