import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    userInfo: {},
  }),
  getters: {
    // double: (state) => state.count * 2,
  },
  actions: {
    setUserInfo(info: any) {
      this.userInfo = info
      sessionStorage.setItem('token', info?.ticket)
    },
    setTicket(t: string) {
      this.userInfo = { ...this.userInfo, ticket: t }
    },
    resetUserInfo() {
      sessionStorage.removeItem('token')
      this.userInfo = {}
    },
  },
})

export default useUserStore
