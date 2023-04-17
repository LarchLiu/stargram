import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
// import '@unocss/reset/tailwind.css'
import App from './App.vue'
import '../styles/styles.css'
import 'uno.css'

const i18n = createI18n({
  locale: 'en',
  messages,
})
const app = createApp(App)
app.use(i18n).mount(document.querySelector('#app'))
