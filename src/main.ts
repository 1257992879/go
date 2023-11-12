import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane, faComputer, faBookOpen, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
library.add(faPaperPlane, faComputer, faBookOpen, faMagnifyingGlass)

const app = createApp(App)
app.use(ElementPlus)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

import './registerServiceWorker'
