import { defineStore } from 'pinia';
import { useHttp } from "@/api/http"

export const useBookApi = defineStore('bookApi', {
  state: () => ({
    data: null,
  }),
actions: {
  async bookApiList(params = {}) {  // params 기본값 빈 객체로
    const http = useHttp()

    try {
      const response = await http.get('/search-book', params)  // params 전달
      this.data = response
      return response  // 호출부에서 결과를 바로 쓸 수 있도록
    } catch (error) {
      if (error.response) {
        return error.response  // 에러도 반환하거나 적절히 처리
      } else {
        throw error
      }
    }
  }
}
});

