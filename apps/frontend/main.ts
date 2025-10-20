import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import App from './LandingPage.vue'
import { router } from './router'

const app = createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .use(router)
  .directive('tooltip', Tooltip)
  .mount('#app')
