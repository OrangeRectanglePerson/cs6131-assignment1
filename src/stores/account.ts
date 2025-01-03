import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    signed_in: false,
    username: '',
  }),
  actions: {
    sign_in(_username: string) {
      this.username = _username
      this.signed_in = true
    },
  },
})
