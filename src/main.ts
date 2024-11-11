import { createApp } from 'vue'
import '@/assets/css/reset.css'

import App from './App.vue'
import router from './router'
import store from './store'

import SvgIcon from '@/component/SvgIcon.vue'

import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(store)
app.use(router)
app.component('SvgIcon', SvgIcon)

app.mount('#app')
