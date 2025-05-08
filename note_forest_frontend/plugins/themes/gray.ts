import {type ThemeDefinition} from "vuetify"

export const grayLight: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#f5f5f5',
        surface: '#ffffff',
        primary: '#9e9e9e',
        'primary-darken-1': '#7e7e7e',
        secondary: '#bdbdbd',
        'secondary-darken-1': '#9e9e9e',
        error: '#d32f2f',
        info: '#1976d2',
        success: '#388e3c',
        warning: '#fbc02d',
    },
}

export const grayNight: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#1e1e1e',
        surface: '#2c2c2c',
        primary: '#9e9e9e',
        'primary-darken-1': '#7e7e7e',
        secondary: '#bdbdbd',
        'secondary-darken-1': '#9e9e9e',
        error: '#cf6679',
        info: '#90caf9',
        success: '#81c784',
        warning: '#ffb74d',
    },
}