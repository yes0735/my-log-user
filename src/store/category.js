import { defineStore } from "pinia";
import { useHttp } from "@/api/http";

export const useCategory = defineStore('category', {
  state: () => ({
    categoryList: [], 
  }),

  actions: {
    async fetchCategoryList(params = {}) {
      const http = useHttp();

      try {
        const response = await http.get('/book-category', { params });
        console.log('카테고리 호출 - response', response);
        this.categoryList = response.data;  // .data 꼭 확인
        return response;
      } catch (error) {
        if (error.response) {
          return error.response;
        } else {
          throw error;
        }
      }
    }
  }
});
