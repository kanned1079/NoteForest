import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import dotenv from 'dotenv'

// dotenv.config()

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    // devtools: { enabled: true },
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }))
            })
        },
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        // '@nuxtjs/axios',
        'pinia-plugin-persistedstate/nuxt',
    ],
    i18n: {
        strategy: 'prefix',
        defaultLocale: 'zh-cn',
        locales: [
            { code: 'zh-cn', name: 'Chinese', file: 'cn.json' },
            { code: 'en-us', name: 'English', file: 'en.json' },
            { code: 'ja-jp', name: 'Japanese', file: 'ja.json' },
        ]
    },
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
        server: {

        }
    },
    app: {
        head: {
            title: 'Note Forest',
            link: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: '/note_forest_icon.png'
                }
            ]
        },
        layoutTransition: {
            name: 'fade',
            mode: 'out-in'
        }
    },
    runtimeConfig: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    css: ['~/assets/css/transitions.css']
})