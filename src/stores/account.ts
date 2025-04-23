import { defineStore } from 'pinia'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const useAccountStore = defineStore('account', {
  state: () => ({
    signed_in: false,
    username: localStorage.getItem("username") === null ? "" : localStorage.getItem("username")!,
    userid: localStorage.getItem("userid") === null ? "" : localStorage.getItem("userid")!,
    session_key: localStorage.getItem("session_key") === null ? "" : localStorage.getItem("session_key")!,
    account_type: localStorage.getItem("account_type") === null ? -1 : parseInt(localStorage.getItem("account_type")!),
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
          .then((response) => {
              if(!response.ok) return Promise.reject(response)
              else return response.text()
          })
          .then((json_text : string) => {
            const json_response = JSON.parse(json_text)
            console.log(json_response)
            if(json_response["login_success"]) {
              this.signed_in = true
              this.username = json_response["text"]
              localStorage.setItem("username", json_response["text"])
              this.userid = json_response["confirmed_userid"]
              localStorage.setItem("userid", json_response["confirmed_userid"])
              this.session_key = json_response["session_key"]
              localStorage.setItem("session_key", json_response["session_key"])
              this.account_type = json_response["account_type"]
              localStorage.setItem("account_type", json_response["account_type"])
              return "success"
            }
            return json_response["text"]
          })

          .catch(error => {
              console.log(error)
              return error
          })
    },
    restore_session(){
      if(
        localStorage.getItem("userid") !== null
        && localStorage.getItem("session_key") !== null
        && localStorage.getItem("username") !== null
        && localStorage.getItem("account_type") !== null){
        return fetch(`${BACKEND_URL}/is_logged_in`, {
          method: "POST",
          body: JSON.stringify({
            userid : localStorage.getItem("userid"),
            session_key: localStorage.getItem("session_key")
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then((response) => {
            if(!response.ok) return Promise.reject(response)
            else return response.text()
        })
        .then((json_text : string) => {
          const json_response = JSON.parse(json_text)
          console.log(json_response)
          if(json_response["logged_in"]) {
            this.signed_in = true
            this.username = localStorage.getItem("username")!
            this.userid = localStorage.getItem("userid")!
            this.session_key = localStorage.getItem("session_key")!
            this.account_type = parseInt(localStorage.getItem("account_type")!)
          } else {
            this.signed_in = false
          }
        })

        .catch(error => {
            console.log(error)
            return error
        })
      }
    },
    sign_out() {
      return fetch(`${BACKEND_URL}/logout`, {
        method: "POST",
        body: JSON.stringify({
          logout_userid : this.userid,
          logout_session_key: this.session_key
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })
          .then((response) => {
              if(!response.ok) return Promise.reject(response)
              else return response.text()
          })
          .then((json_text : string) => {
            const json_response = JSON.parse(json_text)
            console.log(json_response)
            this.signed_in = false
            localStorage.removeItem("username")
            localStorage.removeItem("userid")
            localStorage.removeItem("session_key")
            localStorage.removeItem("account_type")
            this.userid = ""
            this.username = ""
            this.session_key = ""
            this.account_type = -1
            if(json_response["logout_success"]) {
              return "success"
            }
            return json_response["text"]
          })

          .catch(error => {
              console.log(error)
              return error
          })
    },
    add_favourite(id: string) {
      this.favourites.push(id)
    },
    remove_favourite(id: string) {
      this.favourites = this.favourites.filter((i) => i !== id)
    },
  },
})
