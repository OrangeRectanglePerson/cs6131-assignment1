<script setup lang="ts">
import '@/assets/main.css'
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
//import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const acc_store = useAccountStore()
//const route = useRoute()

//universal
const acc_type = ref(0)
const new_acc_name = ref("")
const new_acc_contact_no = ref("")
//patient
const new_acc_nric = ref("")
const new_acc_residence = ref("")
const new_acc_dob = ref("")
//all staff
const new_acc_startshift = ref("")
const new_acc_endshift = ref("")
//doctors and specialists
const new_acc_cert_text = ref("")
const new_acc_cert_expiry = ref("")
//universal account identifiers
const new_acc_password = ref("")
const new_acc_password_confirm = ref("")

const alertText = ref('')

function create_account(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  if(new_acc_password.value !== new_acc_password_confirm.value){
    alertText.value = "Passwords are not the same!"
    return null
  }
  return fetch(`${BACKEND_URL}/create_acc`, {
        method: "POST",
        body: JSON.stringify({
          "sponsor_userid" : acc_store.userid,
          "sponsor_session_key" : acc_store.session_key,
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
            if(json_response["created_success"]) {
              alertText.value = "Account " + json_response["userid"] + " Created"
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

    <h1 class="not-staff" v-if="!acc_store.signed_in">Sign in as staff to create new account.</h1>
    <form role="form" v-on:submit="create_account" v-else-if="acc_store.userid[0]==='S'">
      <label for="account_type">Account Type:</label>
      <select name="account_type" id="account_type" v-model="acc_type">
        <option value=0>Patient</option>
        <option value=1>Doctor</option>
        <option value=2>Non-Consulting Specialist</option>
        <option value=3>Pharmacist</option>
      </select>
      <!-- Common -->
      <label for="name">Name:</label>
      <input id="name" type="text" placeholder="Name" v-model="new_acc_name" />
      <label for="c_no">Contact Number:</label>
      <input id="c_no" type="text" placeholder="Contact Number" v-model="new_acc_contact_no" />
      <p class="divider"></p>
      <!-- Patient -->
      <label v-if="acc_type == 0" for="nric">NRIC:</label>
      <input v-if="acc_type == 0" id="nric" type="text" placeholder="NRIC" v-model="new_acc_nric" />
      <label v-if="acc_type == 0" for="dob">Date Of Birth:</label>
      <input v-if="acc_type == 0" id="dob" type="date" placeholder="Date Of Birth" v-model="new_acc_dob" />
      <label v-if="acc_type == 0" for="residence">Place Of Residence:</label>
      <input v-if="acc_type == 0" id="residence" type="text" placeholder="" v-model="new_acc_residence" />
      <!-- All Staff -->
      <label v-if="acc_type > 0" for="start_shift">Start Shift:</label>
      <input v-if="acc_type > 0" id="start_shift" type="time" placeholder="Shift start time" v-model="new_acc_startshift" />
      <label v-if="acc_type > 0" for="end_shift">End Shift:</label>
      <input v-if="acc_type > 0" id="end_shift" type="time" placeholder="Shift start time" v-model="new_acc_endshift" />
      <!-- Doctors -->
      <label v-if="acc_type == 1" for="start_shift">Medical Licence Type:</label>
      <input v-if="acc_type == 1" id="start_shift" type="text" placeholder="" v-model="new_acc_cert_text" />
      <label v-if="acc_type == 1" for="end_shift">Medical Licence Expiry Date:</label>
      <input v-if="acc_type == 1" id="end_shift" type="date" placeholder="" v-model="new_acc_cert_expiry" />
      <!-- Specialists -->
      <label v-if="acc_type == 2" for="start_shift">Specialist Certification:</label>
      <input v-if="acc_type == 2" id="start_shift" type="text" placeholder="" v-model="new_acc_cert_text" />
      <label v-if="acc_type == 2" for="end_shift">Certification Expiry Date:</label>
      <input v-if="acc_type == 2" id="end_shift" type="date" placeholder="" v-model="new_acc_cert_expiry" />
      <p class="divider"></p>

      <label for="password">Password:</label>
      <input id="password" type="password" placeholder="" v-model="new_acc_password" />
      <label for="password2">Confirm Password:</label>
      <input id="password2" type="password" placeholder="" v-model="new_acc_password_confirm" />
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button class="btn" type="submit">Create Account</button>
    </form>
    <h1 class="not-staff" v-else>Only staff can create new accounts</h1>

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
