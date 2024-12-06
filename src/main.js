import { createApp } from 'vue'
import App from './App.vue'


import { createPinia } from 'pinia'
import router from "./router";
import axios from 'axios'
// Vuetify
import vuetify from "@/plugins/vuetify";

// import './mixin/Common.js'

// custom-theme.css
import '@/assets/css/styles.css'
import '@/assets/js/scripts.js'

import AppNavigation from '@/layouts/AppNavigation.vue'
import AppFooter from '@/layouts/AppFooter.vue'

const app = createApp(App)


app.use(createPinia())
app.use(router)  // 라우터 사용
app.use(vuetify)

app.config.globalProperties.$axios = axios

app.component('AppNavigation', AppNavigation)
app.component('AppFooter', AppFooter)

app.mount('#app')
