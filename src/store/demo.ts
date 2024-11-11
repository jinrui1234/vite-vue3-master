import { defineStore } from 'pinia'

const useDemoStore = defineStore('demo', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count = this.count + 1
    },
  },
})

export default useDemoStore
