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
      this.userInfo = {
        name: info?.name,
        role: info?.role,
        user_id: info?.user_id,
      }
    },
    resetUserInfo() {
      this.userInfo = {}
    },
  },
})

export default useUserStore
