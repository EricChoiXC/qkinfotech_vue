import { defineStore } from 'pinia'
import request from '@/utils/request2.js'
import layoutLoader from '@/router/loader'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auths: {},
  }),

  actions: {
    addAuth(userId, auths) {
      this.auths[userId] = auths
    },
    async getAuth(userId) {
      if (this.auths[userId] == undefined) {
        const requestInstance = new request(null)
        var res = await requestInstance.get('/pm/userController/loadUserAuths')
        this.addAuth(userId, res.auths)
      }
      return this.auths[userId]
    },
  },
})
