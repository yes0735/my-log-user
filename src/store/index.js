import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
  state: () => ({
    modals: [],
    cancelTokens: [],
    requestCount: 0,
  }),
  actions: {
    addCancelToken(source) {
      this.cancelTokens.push(source)
    },
    increaseRequestCount() {
      this.requestCount++
    },
    decreaseRequestCount() {
      this.requestCount--
    },
    clearCancelTokens() {
      this.cancelTokens = []
    },
  },
})
