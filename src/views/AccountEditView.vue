<script setup lang="ts">
import '@/assets/main.css'
import { onBeforeMount, ref } from 'vue'
import { useAccountStore } from '@/stores/account'
//import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const acc_store = useAccountStore()
//const route = useRoute()

//universal
const acc_type = ref(-1)
const pw_changed = ref(false)
let old_acc_name = ""
const new_acc_name = ref("")
let old_acc_contact_no = ""
const new_acc_contact_no = ref("")
//patient
let old_acc_nric = ""
const new_acc_nric = ref("")
let old_acc_residence = ""
const new_acc_residence = ref("")
let old_acc_dob = ""
const new_acc_dob = ref("")
//all staff
let old_acc_startshift = ""
const new_acc_startshift = ref("")
let old_acc_endshift = ""
const new_acc_endshift = ref("")
//doctors and specialists
let old_acc_cert_text = ""
const new_acc_cert_text = ref("")
let old_acc_cert_expiry = ""
const new_acc_cert_expiry = ref("")
//universal account identifiers
const old_acc_password = ref("")
const new_acc_password = ref("")
const new_acc_password_confirm = ref("")

const alertText = ref('')


onBeforeMount(() => {
  fetch(`${BACKEND_URL}/get_account_details`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "userid" : acc_store.userid,
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
    })
  })
  .then((response) => {
    if(!response.ok) return Promise.reject(response)
    else return response.text()
  })
  .then((json_text : string) => {
    const json_response = JSON.parse(json_text)
    console.log(json_response)
    if(json_response["request_success"]) {
      acc_type.value = json_response["acc_type"]
      const data_tuple = json_response["data_tuple"]
      if(acc_type.value === 0){
        old_acc_name = data_tuple[3]
        old_acc_contact_no = data_tuple[4]
        old_acc_nric = data_tuple[1]
        old_acc_residence = data_tuple[5]
        old_acc_dob = data_tuple [2]
      }
      if(acc_type.value > 0){
        old_acc_name = data_tuple[1]
        old_acc_contact_no = data_tuple[4]
        old_acc_startshift = data_tuple[2]
        old_acc_endshift = data_tuple[3]
        if(acc_type.value < 3){
          old_acc_cert_text = data_tuple[5]
          old_acc_cert_expiry = data_tuple[6]
        }
      }
      alertText.value = "Keep fields not to be edited blank."
    }
    else{
      acc_type.value = -1
    }
  })
  .catch(error => {
      console.log(error)
  })
})


function edit_account(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  if(new_acc_password.value !== new_acc_password_confirm.value){
    alertText.value = "Passwords are not the same!"
    return null
  }
  return fetch(`${BACKEND_URL}/edit_own_acc`, {
        method: "POST",
        body: JSON.stringify({
          "editor_userid" : acc_store.userid,
          "editor_session_key" : acc_store.session_key,
          "acc_type" : acc_type.value,
          "new_acc_name" : new_acc_name.value,
          "new_acc_nric" : new_acc_nric.value,
          "new_acc_contact_no" : new_acc_contact_no.value,
          "new_acc_residence": new_acc_residence.value,
          "new_acc_dob" : new_acc_dob.value,
          "new_acc_startshift" : new_acc_startshift.value,
          "new_acc_endshift" : new_acc_endshift.value,
          "new_acc_cert_text" : new_acc_cert_text.value,
          "new_acc_cert_expiry" : new_acc_cert_expiry.value,
          "old_acc_password" : old_acc_password.value,
          "new_acc_password" : new_acc_password.value
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
            if(json_response["edited_success"]) {
              alertText.value = "Account " + json_response["edited_userid"] + " Successfully Edited."
              if(json_response["new_name"] !== "") acc_store.username = json_response["new_name"]
              if(json_response["password_change_intent"]) {
                if(json_response["password_changed"]){
                  acc_store.signed_in = false
                  pw_changed.value = true
                }
                else {
                  alertText.value += " Password was not changed."
                }
              }
            }
            else{
              alertText.value = json_response["text"]
            }
          })
          .catch(error => {
              console.log(error)
          })
}
</script>

<template>
  <main>
    <TopRightLogo/>

    <h1 class="not-staff" v-if="pw_changed">Your account's password was changed.</h1>
    <h1 class="not-staff" v-if="!acc_store.signed_in || acc_type<0">Sign in to edit your account.</h1>
    <form role="form" v-on:submit="edit_account" v-else>
      <!-- Common -->
      <label for="name">Name:</label>
      <input id="name" type="text" :placeholder="old_acc_name" v-model="new_acc_name" />
      <label for="c_no">Contact Number:</label>
      <input id="c_no" type="text" :placeholder="old_acc_contact_no" v-model="new_acc_contact_no" />
      <p class="divider"></p>
      <!-- Patient -->
      <label v-if="acc_type == 0" for="nric">NRIC:</label>
      <input v-if="acc_type == 0" id="nric" type="text" :placeholder="old_acc_nric" v-model="new_acc_nric" />
      <label v-if="acc_type == 0" for="dob">Date Of Birth:</label>
      <input v-if="acc_type == 0" id="dob" type="date" :placeholder="old_acc_dob" v-model="new_acc_dob" />
      <label v-if="acc_type == 0" for="residence">Place Of Residence:</label>
      <input v-if="acc_type == 0" id="residence" type="text" :placeholder="old_acc_residence" v-model="new_acc_residence" />
      <!-- All Staff -->
      <label v-if="acc_type > 0" for="start_shift">Start Shift:</label>
      <input v-if="acc_type > 0" id="start_shift" type="time" :placeholder="old_acc_startshift" v-model="new_acc_startshift" />
      <label v-if="acc_type > 0" for="end_shift">End Shift:</label>
      <input v-if="acc_type > 0" id="end_shift" type="time" :placeholder="old_acc_endshift" v-model="new_acc_endshift" />
      <!-- Doctors -->
      <label v-if="acc_type == 1" for="start_shift">Medical Licence Type:</label>
      <input v-if="acc_type == 1" id="start_shift" type="text" :placeholder="old_acc_cert_text" v-model="new_acc_cert_text" />
      <label v-if="acc_type == 1" for="end_shift">Medical Licence Expiry Date:</label>
      <input v-if="acc_type == 1" id="end_shift" type="date" :placeholder="old_acc_cert_expiry" v-model="new_acc_cert_expiry" />
      <!-- Specialists -->
      <label v-if="acc_type == 2" for="start_shift">Specialist Certification:</label>
      <input v-if="acc_type == 2" id="start_shift" type="text" :placeholder="old_acc_cert_text" v-model="new_acc_cert_text" />
      <label v-if="acc_type == 2" for="end_shift">Certification Expiry Date:</label>
      <input v-if="acc_type == 2" id="end_shift" type="date" :placeholder="old_acc_cert_expiry" v-model="new_acc_cert_expiry" />
      <p class="divider"></p>
      <label for="password">Current Password:</label>
      <input id="password" type="password" placeholder="" v-model="old_acc_password" />
      <label for="password">New Password:</label>
      <input id="password" type="password" placeholder="" v-model="new_acc_password" />
      <label for="password2">Confirm Password:</label>
      <input id="password2" type="password" placeholder="" v-model="new_acc_password_confirm" />
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button class="btn" type="submit">Edit Account Details</button>
    </form>

  </main>
</template>

<style scoped>
main {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 1em;
  left: 0;
  background-color: rgb(var(--color-main-3));
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

form {
  gap: 1em;
  display: flex;
  flex-direction: column;
  width: 20em;
  max-width: 90vw;
  align-self: center;
  margin: 5em auto;
}
form > label {
  color: white;
  line-height: 1;
}

.not-staff{
  align-self: center;
  margin: auto;
}

.btn {
  transition: 0.3s;
  padding: 0 1em;
  color: black !important;
  background-color: rgb(var(--color-contrast-light)) !important;
  width: fit-content;
  align-self: center;
}
.btn:hover {
  filter: brightness(85%);
  transition: 0.3s;
}

p {
  align-self: center;
  color: white;
  line-height: 1.6;
  padding: 0 1em;
  margin: 0;
  background-color: rgb(var(--color-contrast-dark));
  animation:
    alertLoop 0.5s ease-in-out 0s 1 forwards,
    alertAppear 0.5s ease-out 0s 1 forwards;
}
.p {
  height: 1.6em;
}

.divider{
  width: 100%;
  border: solid;
  border-width: 0 0 1px 0;
  border-image: linear-gradient(to right, transparent 0%, white 15% 85%, transparent 100%) 1;
}

@keyframes alertAppear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes alertLoop {
  0% {
    background-color: rgb(var(--color-contrast-dark));
    color: white;
  }
  50% {
    background-color: rgb(var(--color-contrast-light));
    color: black;
  }
  100% {
    background-color: rgb(var(--color-contrast-dark));
    color: white;
  }
}
@media (max-width: 100vh) {
  .top {
    grid-template-columns: auto;
  }
  .searchbar {
    margin: 0 2.5vw;
    grid-column: 1;
  }

  .search-querier {
    font-size: larger;
    text-align: center;
  }
}
</style>
