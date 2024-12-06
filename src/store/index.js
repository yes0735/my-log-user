import { defineStore } from 'pinia';
// import '@/mixin/http.js'

export const usePostStore = defineStore('storeId',{
	state: () => ({
		contents: [],
	}),
})