import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"
import { useHttp } from "@/api/http"
import { ref } from "vue"

// const JWT_EXPIRE_TIME = 1000 * 3600

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      accessToken: null,
      refreshToken: null,
    },
    refreshTimerId: null,
  }),
  getters: {
    decodedToken: (state) => {
      if (state.user.accessToken) {
        try {
          return jwtDecode(state.user.accessToken)
        } catch (error) {
          console.error("Token decode error:", error)
          return null
        }
      }
      return null
    },
    userName: (state) => {
      return state.decodedToken?.name || ""
    },
    accountNo: (state) => {
      return state.decodedToken?.no || ""
    },
    userId: (state) => {
      return state.decodedToken?.id || ""
    },
    userEmail: (state) => {
      return state.decodedToken?.email || ""
    },
  },
  actions: {
    async login(payload) {
      const http = useHttp()
      let response = null

      try {
        response = await http.post("/login", payload)

        if (response && response.result.accessToken) {
          this.setUser({
            accessToken: response.result.accessToken,
            refreshToken: response.result.refreshToken,
          })
        }

      } catch (error) {
        if (error.response) {
          response = error
        } else {
          throw error
        }
      }

      return response
    },
    setUser(userData) {
      this.user = {
        ...this.user,
        ...userData,
      }

      // 토큰을 로컬스토리지에 저장
      localStorage.setItem('accessToken', userData.accessToken)
      localStorage.setItem('refreshToken', userData.refreshToken)

    },
    restoreToken() {
      this.user.accessToken = localStorage.getItem('accessToken')
      this.user.refreshToken = localStorage.getItem('refreshToken')
    },
    async refresh(payload) {
      const http = useHttp()
      let response = null

      try {
        response = await http.put("/login/refresh", {
          refreshToken: this.user.refreshToken,
        })

        if (response && response.result.accessToken) {
          this.setUser({
            accessToken: response.result.accessToken,
            refreshToken: response.data.result.refreshToken || this.user.refreshToken,
          })
          this.scheduleTokenRefresh(900) // 예: 15분 후 다시 갱신
          return true
        }
      } catch (error) {
        if (error.response) {
          response = error
        } else {
          throw error
        }
        // this.clearTokens()
        // window.location.href = '/login'
      }

      return false
    },
    clearUser() {
      this.user = {
        accessToken: null,
        refreshToken: null,
      }
    
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    
      if (this.refreshTimerId) {
        clearTimeout(this.refreshTimerId)
        this.refreshTimerId = null
      }
    },
    // Silent Refresh 타이머 설정
    scheduleTokenRefresh(expireInSec = 900) {
      if (this.refreshTimerId) clearTimeout(this.refreshTimerId)

      this.refreshTimerId = setTimeout(() => {
        this.refreshAccessToken()
      }, (expireInSec - 60) * 1000) // 만료 1분 전
    },
    async logout() {
      try {
        // API 호출 로직
        // await http.put("/logout", {
        //   refreshToken: this.user.refreshToken,
        // })
        this.clearUser()
      } catch (error) {
        throw error
      }
    },
    async verifyCode(payload = {}) {
      const http = useHttp()
      let response = null
      
      try {
        response = await http.post("/auth/find-account/verify-code", payload)
      } catch (error) {
        if (error.response) {
          response = error
        } else {
          throw error
        }
      }
      
      return response
    },
    async verifyCodeConfirm(payload = {}) {
      const http = useHttp()
      let response = null
      
      try {
        response = await http.post("/auth/find-account/verify-code/confirm", payload)
      } catch (error) {
        if (error.response) {
          response = error
        } else {
          throw error
        }
      }
      
      return response
    },

  },
})
