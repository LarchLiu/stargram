import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import App from './App.vue'
import 'uno.css'

const rootIdName = 'stargram_content_script'
const beforeRoot = document.querySelector(`#${rootIdName}`)
if (beforeRoot && __DEV__)
  document.body.removeChild(beforeRoot)

const container = document.createElement('div')
container.id = rootIdName
const root = document.createElement('div')
const styleEl = document.createElement('link')
const shadowDOM
    = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
styleEl.setAttribute('rel', 'stylesheet')
styleEl.setAttribute('href', chrome.runtime.getURL('contentScript/style.css'))
shadowDOM.appendChild(styleEl)
shadowDOM.appendChild(root)
document.body.appendChild(container)

const i18n = createI18n({
  locale: 'en',
  messages,
})
const app = createApp(App)
app.use(i18n).mount(root)
