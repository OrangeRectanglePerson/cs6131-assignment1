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
const id = ref(-1)
const name = ref("")
const quantity = ref(0)
const medicine = ref({code : "", label : ""})

const list_of_medicine = ref([{code : "", label : ""}])

const alertText = ref('')

onBeforeMount(() => {
  if(!acc_store.signed_in || acc_store.account_type < 1){
    return
  }
  get_medicine()
})

function edit_medicine(when_done? : (() => void) | undefined) {
  alertText.value = ''
  let mode = ""
  if(form_type.value === 3) mode = "delete"
  else if(form_type.value === 2) mode = "dispense"
  else if (form_type.value === 1) mode = "restock"
  else mode = "add"
  return fetch(`${BACKEND_URL}/edit_medicine`, {
    method: "POST",
    body: JSON.stringify({
      "userid" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "medicine_id" : mode==="add" ? id.value : medicine.value.code,
      "name" : name.value,
      "quantity" : quantity.value,
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

function get_medicine(when_done? : (() => void) | undefined){
  list_of_medicine.value = []
  medicine.value = {code : "", label : ""}
  fetch(`${BACKEND_URL}/get_medicine`, {
    method: "POST",
    body: JSON.stringify({
      "start_from" : 0,
      "num_results" : 999,
      "no_stock" : true,
      "in_stock" : true,
      "search_text": "%",
      "specific_id" : null
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
      for (const p of json_response['list']){
        list_of_medicine.value = list_of_medicine.value.concat({code : p[0], label : p[0]+' | '+p[1]+' | Q:'+p[2]})
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
  edit_medicine(() => get_medicine())
}
</script>

<template>
  <main>
    <TopRightLogo/>

    <h1 class="not-staff" v-if="!acc_store.signed_in">Please sign in.</h1>
    <h1 class="not-staff" v-else-if="acc_store.account_type !== 3">Only Pharmacists are allowed to do this.</h1>
    <form role="form" v-on:submit="onsubmit" v-else>
      <h2>Medicine Database Editor</h2>
      <div class="formselector">
        <input id="add" name="formtype" type="radio" :value=0 v-model="form_type" v-on:change="get_medicine()" checked/>
        <label for="add">Add </label>
        <p></p>
        <input id="restock" name="formtype" type="radio" :value=1 v-model="form_type" v-on:change="get_medicine()"/>
        <label for="restock">Restock </label>
        <p></p>
        <input id="dispense" name="formtype" type="radio" :value=2 v-model="form_type" v-on:change="get_medicine()"/>
        <label for="dispense">Dispense </label>
        <p></p>
        <input id="delete" name="formtype" type="radio" :value=3 v-model="form_type" v-on:change="get_medicine()"/>
        <label for="delete">Delete </label>
      </div>
      <div class="namefield" v-if="form_type < 1">
        <label for="name">ID:</label>
        <input id="name" type="text" placeholder="Name" v-model="id" />

        <label for="name">Name:</label>
        <input id="name" type="text" placeholder="Name" v-model="name" />
      </div>
      <div class="namefield" v-else>
        <label for="name">Medicine:</label>
        <v-select class="selector" id="name" :options="list_of_medicine" v-model="medicine"></v-select>
      </div>
      <label v-if="form_type < 3" for="c_no">Quantity:</label>
      <input v-if="form_type < 3" id="c_no" type="number" :min=0 placeholder="Quantity" v-model="quantity" />
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button v-if="form_type === 3" class="btn" type="submit">Delete Medicine</button>
      <button v-else-if="form_type === 2" class="btn" type="submit">Dispense Medicine</button>
      <button v-else-if="form_type === 1" class="btn" type="submit">Restock Medicine</button>
      <button v-else-if="form_type === 0" class="btn" type="submit">Add New Medication</button>
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
