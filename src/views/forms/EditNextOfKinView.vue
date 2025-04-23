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
const form_type = ref(0)
const patient = ref({code : "", label : ""})
const nok_name = ref("")
const nok_relation = ref("")
const nok_contact = ref("")
const placeholder_relation = ref("Relationship")
const placeholder_contact = ref("Contact Number")

const list_of_patients = ref([{code : "", label : ""}])
const list_of_nok = ref([])

let old_patient_code = ""

const alertText = ref('')

onBeforeMount(() => {
  if(!acc_store.signed_in){
    return
  }
  form_change()
})

function edit_nok(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  if(nok_name.value === "" || nok_contact.value === "" || nok_relation.value === "" || patient.value.code === ""){
    alertText.value = "Please fill in all fields."
    return
  }
  let mode = ""
  if(form_type.value === 2) mode = "delete"
  else if (form_type.value === 1) mode = "update"
  else mode = "add"
  return fetch(`${BACKEND_URL}/edit_next_of_kin`, {
        method: "POST",
        body: JSON.stringify({
          "requester_id" : acc_store.userid,
          "session_key" : acc_store.session_key,
          "patient_id" : patient.value.code,
          "name" : nok_name.value,
          "relation" : nok_relation.value,
          "contact" : nok_contact.value,
          "mode" : mode
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
          alertText.value = "Next of Kin for "+patient.value.label+" "+mode+(mode==="add" ? "ed" : "d")
        }
        else{
          alertText.value = json_response["text"] + " Note that no Next Of Kin are allowed to share the same name."
        }
      })
      .catch(error => {
          console.log(error)
      })
}

function get_patients(when_done? : () => void | undefined){
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
        alertText.value = json_response["text"]
      }
      if(when_done !== undefined) when_done()
    })
    .catch(error => {
        console.log(error)
    })
  }
}

function get_nok(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_next_of_kin`, {
    method: "POST",
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : patient.value.code
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
      for (const nok of json_response["list"]){
        list_of_nok.value = list_of_nok.value.concat(nok[1])
      }
    } else {
      console.log(json_response["text"])
    }
    if(when_done !== undefined) when_done()
  })
  .catch(error => {
      console.log(error)
  })
}

function form_change(){
  list_of_patients.value = [{code : "", label : ""}]
  list_of_nok.value = []
  placeholder_relation.value = "Relationship"
  placeholder_contact.value = "Contact Number"
  if(form_type.value === 2){
    get_patients(() => get_nok())
  }
  else if (form_type.value === 1){
    get_patients(() => get_nok())
  } else {
    get_patients()
  }
}

function patient_change(){
  if(form_type.value > 0 && patient.value.code !== old_patient_code){
    list_of_nok.value = []
    get_nok()
    old_patient_code = patient.value.code
  }
}
</script>

<template>
  <main>
    <TopRightLogo/>

    <h1 class="not-staff" v-if="!acc_store.signed_in">Sign in create new next of kin.</h1>
    <form role="form" v-on:submit="edit_nok" v-else>
      <div class="formselector">
        <input id="add" name="formtype" type="radio" :value=0 v-model="form_type" v-on:change="form_change" checked/>
        <label for="add">Add </label>
        <p></p>
        <input id="edit" name="formtype" type="radio" :value=1 v-model="form_type" v-on:change="form_change"/>
        <label for="edit">Edit </label>
        <p></p>
        <input id="delete" name="formtype" type="radio" :value=2 v-model="form_type" v-on:change="form_change"/>
        <label for="delete">Delete </label>
      </div>
      <label for="patient">Patient:</label>
      <v-select class="selector" id="patient" :options="list_of_patients" v-model="patient" :option:selected="patient_change()"></v-select>
      <div class="namefield" v-if="form_type < 1">
        <label for="name">Name:</label>
        <input id="name" type="text" placeholder="Name" v-model="nok_name" />
      </div>
      <div class="namefield" v-else>
        <label for="name">Name:</label>
        <v-select class="selector" id="name" :options="list_of_nok" v-model="nok_name"></v-select>
      </div>
      <label v-if="form_type < 2" for="c_rel">Relationship:</label>
      <input v-if="form_type < 2" id="c_rel" type="text" placeholder="Relationship" v-model="nok_relation" />
      <label v-if="form_type < 2" for="c_no">Contact Number:</label>
      <input v-if="form_type < 2" id="c_no" type="text" placeholder="Contact Number" v-model="nok_contact" />
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button v-if="form_type === 2" class="btn" type="submit">Delete Next of Kin</button>
      <button v-else-if="form_type === 1" class="btn" type="submit">Edit Next of Kin</button>
      <button v-else-if="form_type === 0" class="btn" type="submit">Add Next of Kin</button>
      <button v-else class="btn" type="submit" disabled>Something's Wrong</button>
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

.formselector{
  display: flex;
  flex-direction: row;
  gap: .5em;
  justify-content: center;
}
.formselector > p{
  margin: 0;
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

.namefield{
  display: flex;
  flex-direction: inherit;
  gap: inherit;
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
