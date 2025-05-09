import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
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
        'pinia-plugin-persistedstate/nuxt',
    ],
    i18n: {
        strategy: 'prefix',
        defaultLocale: 'cn',
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'cn', name: 'Chinese', file: 'cn.json' }
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
        layoutTransition: {
            name: 'fade',
            mode: 'out-in'
        }
    },
    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:8081'
        }
    },
    css: ['~/assets/css/transitions.css']
})