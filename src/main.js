import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import {Autocomplete, Radio, Row, Col, Tabs, TabPane, Button} from 'element-ui'
import './registerServiceWorker'

// Vue.component(Button.name, Button)
Vue.use(Autocomplete)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
// Vue.component(MessageBox)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App)
}).$mount('#app')
