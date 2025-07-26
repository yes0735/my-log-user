import { defineStore } from 'pinia';
import { useHttp } from "@/api/http"

export const useBook = defineStore('book', {
  state: () => ({
    data: null,
  }),
actions: {
  async bookList(params = {}) {  // params 기본값 빈 객체로
    const http = useHttp()

    try {
      const response = await http.get('/my-book',params)  // params 전달
      console.log('bookList 호출 - response:', response)
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

