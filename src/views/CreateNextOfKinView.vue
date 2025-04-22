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
const patient = ref({code : "", label : ""})
const nok_name = ref("")
const nok_relation = ref("")
const nok_contact = ref("")

const list_of_patients = ref([{code : "", label : ""}])

const alertText = ref('')

onBeforeMount(() => {
  if(!acc_store.signed_in){
    return
  }
  if(acc_store.userid[0] === 'P'){
    list_of_patients.value[0]["code"] = acc_store.userid
    list_of_patients.value[0]["label"] = acc_store.userid+' : '+acc_store.username
  }
  else if (acc_store.userid[0] === 'S'){
    fetch(`${BACKEND_URL}/get_patients`, {
      method: "POST",
      body: JSON.stringify({
        "requester_id" : acc_store.userid,
        "session_key" : acc_store.session_key,
        "start_from" : 0,
        "num_results" : 999,
        "search_text" : "%"
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
      if(json_response["request_success"]) {
        list_of_patients.value = []
        for (const p of json_response['list']){
          list_of_patients.value = list_of_patients.value.concat({code : 'P'+p[0], label : 'P'+p[0]+' : '+p[3]})
        }
      }
      else{
        alertText.value = json_response["text"] + " Note that no Next Of Kin are allowed to share the same name."
      }
    })
    .catch(error => {
        console.log(error)
    })
  }
})

function create_account(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  return fetch(`${BACKEND_URL}/edit_next_of_kin`, {
        method: "POST",
        body: JSON.stringify({
          "requester_id" : acc_store.userid,
          "session_key" : acc_store.session_key,
          "patient_id" : patient.value.code,
          "name" : nok_name.value,
          "relation" : nok_relation.value,
          "contact" : nok_contact.value,
          "mode" : "add"
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
        if(json_response["request_success"]) {
          alertText.value = "Next of Kin for " + patient.value.label + " Created"
        }
        else{
          alertText.value = json_response["text"] + " Note that no Next Of Kin are allowed to share the same name."
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

    <h1 class="not-staff" v-if="!acc_store.signed_in">Sign in create new next of kin.</h1>
    <form role="form" v-on:submit="create_account" v-else-if="acc_store.userid[0]==='S'">
      <label for="account_type">Patient:</label>
      <v-select class="selector" id="name" :options="list_of_patients" v-model="patient"></v-select>
      <label for="name">Name:</label>
      <input id="name" type="text" placeholder="Name" v-model="nok_name" />
      <label for="c_no">Relationship:</label>
      <input id="c_no" type="text" placeholder="Contact Number" v-model="nok_relation" />
      <label for="c_no">Contact Number:</label>
      <input id="c_no" type="text" placeholder="Contact Number" v-model="nok_contact" />
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

.selector{
  background-color: white;
  color: black;
  border-radius: .3em;
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
