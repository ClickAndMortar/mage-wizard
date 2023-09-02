import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable } from 'vuetify/labs/VDataTable'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: false,
    components: {
      VDataTable,
      ...components,
    },
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#eb5202',
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
