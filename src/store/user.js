import { defineStore } from 'pinia';
import { useHttp } from "@/api/http"

export const useUser = defineStore('user', {
  state: () => ({
    data: null,
  }),
  actions: {
    async userJoin(payload) {
      const http = useHttp()
      let response = null

      try {
        response = await http.post('/user/join', payload); 
      } catch (error) {
        if (error.response) {
          response = error
        } else {
          throw error
        }
      }

      return response
    }
  },
});