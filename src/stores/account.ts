import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    signed_in: false,
    username: '',
    favourites: [] as string[],
  }),
  actions: {
    sign_in(_username: string) {
      this.username = _username
      this.signed_in = true
    },
    sign_out() {
      this.signed_in = false
    },
    add_favourite(id: string) {
      this.favourites.push(id)
    },
    remove_favourite(id: string) {
      this.favourites = this.favourites.filter((i) => i !== id)
    },
  },
})
