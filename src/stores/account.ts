import { defineStore } from 'pinia'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const useAccountStore = defineStore('account', {
  state: () => ({
    signed_in: false,
    username: '',
    favourites: [] as string[],
  }),
  actions: {
    sign_in(_userid: string, _pw: string) : Promise<string> {

      return fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        body: JSON.stringify({
          proposed_userid : _userid,
          proposed_password: _pw
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })
          // this results in a response promise that promises some sort of response
          // will be received from where the post was sent to


          .then((response) => {
              if(!response.ok) return Promise.reject(response)
              else return response.text()
          })
          .then((json_text : string) => {
            const json_response = JSON.parse(json_text)
            console.log(json_response)
            if(json_response["login_success"]) {
              this.username = json_response["text"]
              this.signed_in = true
              return "success"
            }
            return json_response["text"]
          })

          .catch(error => {
              console.log(error)
              return error
          })
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
