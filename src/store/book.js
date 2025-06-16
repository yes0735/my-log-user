import { defineStore } from 'pinia';
import { useHttp } from "@/api/http"

export const useBook = defineStore('book', {
  state: () => ({
    data: null,
  }),
  actions: {
    async fetchData() {
      const http = useHttp()

      try {
        const response = await http.get('/book'); // baseURL 기준
        this.data = response;
      } catch (error) {
        if (error.response) {
          response = error
        } else {
          throw error
        }
      }
    }
  },
});