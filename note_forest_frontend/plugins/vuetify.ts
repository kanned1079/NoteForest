// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {grayNight, grayLight} from "~/plugins/themes/gray";
import {glacierBlueNight, glacierBlueLight} from "~/plugins/themes/glacierBlue";

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        // ... your configuration
        theme: {
            defaultTheme: 'glacierBlueLight',
            themes: {
                grayNight,
                grayLight,
                glacierBlueNight,
                glacierBlueLight
            }
        }
    })
    app.vueApp.use(vuetify)
})