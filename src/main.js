import { createApp } from "vue"
import Antd from "ant-design-vue"
import App from "./App.vue"
import { createPinia } from "pinia"
import router from "./router"
import axios from "axios"
import vuetify from "@/plugins/vuetify"
import { useCommonStore } from "@/store"

import "./style.css"
import "@/assets/js/scripts.js"

const app = createApp(App)

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ion-")

// axios 인스턴스 생성
const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
})

// axios 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const source = axios.CancelToken.source()
    config.cancelToken = source.token

    const commonStore = useCommonStore()
    commonStore.addCancelToken(source)
    commonStore.increaseRequestCount()

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

// axios 인스턴스를 전역 속성으로 등록
app.config.globalProperties.$http = axiosInstance
app.config.globalProperties.$axios = axios

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Antd)
app.use(vuetify)

// router가 준비되면 앱 마운트
router.isReady().then(() => {
  app.mount("#app")
})
