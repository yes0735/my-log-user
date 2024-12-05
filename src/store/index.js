import { defineStore } from 'pinia';

export const usePostStore = defineStore('storeId',{
	state: () => ({
		contents: [],
	}),
})