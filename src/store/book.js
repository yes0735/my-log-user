import { defineStore } from 'pinia';
import apiClient from '@/api/axios';

export const useBook = defineStore('book', {
  state: () => ({
    data: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.get('/book'); // baseURL 기준
        this.data = response.data;
      } catch (err) {
        this.error = '데이터를 가져오는 중 오류가 발생했습니다.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  },
});