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
const list_of_treatments = ref([{label : "", description : ""}])
const treatment = ref({label : "", description : ""})
const description = ref("")

const list_of_facilties = ref([""])
const chosen_facilties = ref([""])
const facilty = ref("")

let old_treatment_name = ""

const alertText = ref('')

onBeforeMount(() => {
  if(!acc_store.signed_in || acc_store.account_type < 1){
    return
  }
  form_change()
})

function edit_treatment(when_done? : (() => void) | undefined) {
  let mode = ""
  if(form_type.value === 2) mode = "delete"
  else if(form_type.value === 1) mode = "update"
  else {
    mode = "add"
    if (treatment.value.label===""){
      alertText.value="Treatment Needs A Name!"
      return
    }
  }
  return fetch(`${BACKEND_URL}/edit_treatment`, {
    method: "POST",
    body: JSON.stringify({
      "userid" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "name" : treatment.value.label,
      "description" : description.value,
      "facilities" : chosen_facilties.value,
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
    alertText.value = json_response["text"]
    if(when_done !== undefined) when_done()
  })
  .catch(error => {
      console.log(error)
  })
}

function get_treatments(when_done? : (() => void) | undefined){
  treatment.value = {label : "", description : ""}
  fetch(`${BACKEND_URL}/get_treatments`, {
    method: "POST",
    body: JSON.stringify({
      "start_from" : 0,
      "num_results" : 999,
      "search_text": "%",
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
    list_of_treatments.value = []
    if(json_response["request_success"]) {
      for (const p of json_response['list']){
        list_of_treatments.value = list_of_treatments.value.concat({label : p[0], description : p[1]})
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

function get_facilities(when_done? : ((() => void) | undefined) , for_treatment? : (string | undefined)){
  fetch(`${BACKEND_URL}/get_departments`, {
    method: "POST",
    body: JSON.stringify({
      "start_from" : 0,
      "num_results" : 999,
      "search_text": "%",
      "treatment_name" : (for_treatment === undefined) ? "" : for_treatment
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
    if(json_response["request_success"]) {
      if(for_treatment===undefined){
        list_of_facilties.value = []
        for (const p of json_response['list']){
          list_of_facilties.value = list_of_facilties.value.concat(p[0])
        }
      }
      else {
        chosen_facilties.value = []
        for (const p of json_response['list']){
          chosen_facilties.value = chosen_facilties.value.concat(p[0])
        }
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

function onsubmit(event: { preventDefault: () => void }){
  event.preventDefault()
  edit_treatment(() => form_change(true))
}

function form_change(preserve_alert? : boolean){
  if(preserve_alert===undefined || preserve_alert===false)alertText.value = ""
  chosen_facilties.value = []
  list_of_facilties.value = []
  facilty.value = ""
  description.value = ""
  if(form_type.value < 1){
    treatment.value = {label : "", description : ""}
    get_facilities()
  } else {
    get_treatments(() => get_facilities())
  }
}

function change_treatment(){
  if(form_type.value > 0 && treatment.value.label !== old_treatment_name && treatment.value.label!==""){
    description.value = treatment.value.description
    get_facilities(undefined, treatment.value.label)
    old_treatment_name = treatment.value.label
  }
}


function select_facilty(){
  if(facilty.value!==""){
    let already_inside = false
    for (const f of chosen_facilties.value){
      already_inside ||= (f===facilty.value)
    }
    if(!already_inside){
      chosen_facilties.value = chosen_facilties.value.concat(facilty.value)
    } else {
      alertText.value = "Facility is already chosen"
    }
  }
}
function remove_facility(treatment_name : string){
  alertText.value = ""
  chosen_facilties.value = chosen_facilties.value.filter(i => i !== treatment_name)
}
</script>

<template>
  <main>
    <TopRightLogo/>

    <h1 class="not-staff" v-if="!acc_store.signed_in">Please sign in.</h1>
    <h1 class="not-staff" v-else-if="acc_store.account_type < 1 || acc_store.account_type > 2">
      Only doctors and specialists are allowed to do this.
    </h1>
    <form role="form" v-on:submit="onsubmit" v-else>
      <h2>Treatment Database Form</h2>
      <div class="formselector">
        <input id="add" name="formtype" type="radio" :value=0 v-model="form_type" v-on:change="form_change()" checked/>
        <label for="add">Add </label>
        <p></p>
        <input id="edit" name="formtype" type="radio" :value=1 v-model="form_type" v-on:change="form_change()"/>
        <label for="edit">Edit </label>
        <p></p>
        <input id="delete" name="formtype" type="radio" :value=2 v-model="form_type" v-on:change="form_change()"/>
        <label for="delete">Delete </label>
      </div>

      <label for="name">Name:</label>
      <input v-if="form_type == 0" id="name" type="text" placeholder="Name" v-model="treatment.label" />
      <v-select v-else class="selector" id="name" :options="list_of_treatments" v-model="treatment" :option:selected="change_treatment()"></v-select>

      <label v-if="form_type < 2" for="description">Description:</label>
      <textarea v-if="form_type < 2" class="description" v-model="description" rows="5"></textarea>

      <label v-if="form_type < 2" for="facilities">Facility:</label>
      <v-select v-if="form_type < 2" class="selector" id="facilities" :options="list_of_facilties" v-model="facilty"></v-select>

      <button v-if="form_type < 2" class="btn" type="button" v-on:click="select_facilty">Add Facility</button>

      <p v-if="form_type < 2 && chosen_facilties.length > 0" class="divider"></p>

      <h6 v-if="form_type < 2 && chosen_facilties.length > 0">Facility List</h6>
      <div v-if="form_type < 2 && chosen_facilties.length > 0" class="facilities-list">
        <li v-for="m in chosen_facilties" :key="m">
          <RouterLink class="special-hover-thing facility" :to="'/facility?id='+m" target="_blank">
            {{ m }}
          </RouterLink>
          <u v-on:click="remove_facility(m)" class="special-hover-thing del-option">[X]</u>
        </li>
      </div>

      <p class="divider"></p>

      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>

      <div v-else class="p"></div>
      <button v-if="form_type === 2" class="btn" type="submit">Delete Treatment</button>
      <button v-else-if="form_type === 1" class="btn" type="submit">Edit Treatment</button>
      <button v-else-if="form_type === 0" class="btn" type="submit">New Treatment</button>
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

h2{
  text-align: center;
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

.facilities-list{
  padding-inline-start: 1em;
}
.special-hover-thing:hover{
  background-color: rgb(var(--color-main-2));
  text-underline-offset: 0.25em;
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
