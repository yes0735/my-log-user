import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import { createPinia } from 'pinia'
import router from "./router";
import axios from 'axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)  // 라우터 사용

app.config.globalProperties.$axios = axios
app.mount('#app')
