import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"
import { useHttp } from "@/api/http"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      accessToken: null,
    },
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

        if (response && response.accessToken) {
          this.setUser({
            accessToken: response.accessToken,
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
    },

    clearUser() {
      this.user = {
        accessToken: null,
      }
    },

    async logout() {
      try {
        // API 호출 로직
        // await api.logout()
        this.clearUser()
      } catch (error) {
        throw error
      }
    },
  },
})
