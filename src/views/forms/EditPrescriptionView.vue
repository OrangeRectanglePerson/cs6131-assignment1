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
const doctor_note = ref("")
const list_of_patients = ref([{code : "", label : ""}])
const list_of_medicine = ref([{code : "", name: "", label : ""}])

const selected_medicine = ref({code : "", name: "", label : ""})
const dosage_instructions = ref()
// {code : "", name: "", instruction : ""}
const medicine_list = ref([{code : "", name: "", instruction : ""}])

const precription_list = ref([{code : "", label : ""}])
const selected_prescription = ref({code : "", label : ""})
let old_prescription_code = ""



const alertText = ref('')

onBeforeMount(() => {
  if(!acc_store.signed_in || acc_store.account_type !== 1){
    return
  }
  form_change()
})

function edit_prescription(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  let mode = ""
  if(form_type.value === 2) mode = "delete"
  else if (form_type.value === 1) mode = "update"
  else mode = "add"
  fetch(`${BACKEND_URL}/edit_prescription`, {
    method: "POST",
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : patient.value.code,
      "doctors_note": doctor_note.value,
      "prescription_list": medicine_list.value,
      "prescription_id" : selected_prescription.value.code,
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

function get_medicine(when_done? : (() => void) | undefined){
  list_of_medicine.value = []
  selected_medicine.value = {code : "", name: "", label : ""}
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
        list_of_medicine.value = list_of_medicine.value.concat({code : p[0], name:p[1], label : p[0]+' | '+p[1]+' | Q:'+p[2]})
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

function get_prescriptions(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_prescriptions`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : "",
      "pharmacist_id" : "",
      "doctor_id" : acc_store.userid
    })
  })
  .then((response) => {
    if(!response.ok) return Promise.reject(response)
    else return response.text()
  })
  .then((json_text : string) => {
    const json_response = JSON.parse(json_text)
    precription_list.value = []
    if(json_response["request_success"]) {
      for(const p of json_response["list"]){
        precription_list.value = precription_list.value.concat({code: p[0], label : '#'+p[0]+' : '+p[8]})
      }
    }
    if (when_done !== undefined){
      when_done()
    }
  })
  .catch(error => {
      console.log(error)
  })
}

function add_medicine(){
  alertText.value = ""
  if(selected_medicine.value.code !== ''){
    let already_written = false
    for(const p of medicine_list.value){
      already_written ||= (selected_medicine.value.code === p.code)
    }
    if(already_written){
      alertText.value = "Prescription for that medicine is already written!"
    } else {
      medicine_list.value = medicine_list.value.concat(
        {code: selected_medicine.value.code, name: selected_medicine.value.name, instruction: dosage_instructions.value}
      )
    }
  }
}

function remove_medicine(medicine_id : string){
  alertText.value = ""
  let to_remove: {code: string;name: string;instruction: string;}[] = []
  for(const p of medicine_list.value){
    if(p.code === medicine_id) to_remove = to_remove.concat(p)
  }
  for(const q of to_remove){
    medicine_list.value = medicine_list.value.filter(i => i != q)
  }
}

function form_change(){
  list_of_patients.value = []
  list_of_medicine.value = []
  medicine_list.value = []
  selected_medicine.value = {code: "", name: "", label: ""}
  precription_list.value = []
  selected_prescription.value = {code: "", label: ""}
  alertText.value = ""
  if(form_type.value === 2){
    //delete
    get_prescriptions()
  }
  else if (form_type.value === 1){
    //edit
    //no editing implemented
  } else {
    //add
    get_patients(() => get_medicine())
  }
}

function prescription_change(){
  if(form_type.value > 0 && selected_prescription.value.code !== old_prescription_code){
    old_prescription_code = selected_prescription.value.code
  }
}
</script>

<template>
  <main>
    <TopRightLogo/>

    <h1 class="not-staff" v-if="!acc_store.signed_in || acc_store.account_type !== 1">Sign in as a doctor to create new prescription.</h1>
    <form role="form" v-on:submit="edit_prescription" v-else>
      <h2>Prescription Form</h2>
      <div class="formselector">
        <input id="add" name="formtype" type="radio" :value=0 v-model="form_type" v-on:change="form_change" checked/>
        <label for="add">Add </label>
        <p></p>
        <input id="delete" name="formtype" type="radio" :value=2 v-model="form_type" v-on:change="form_change"/>
        <label for="delete">Delete </label>
      </div>
      <label v-if="form_type===0" for="patient">Patient:</label>
      <label v-else for="prescription">Prescription:</label>
      <v-select v-if="form_type===0" class="selector" id="patient" :options="list_of_patients" v-model="patient"></v-select>
      <v-select v-else class="selector" id="prescription" :options="precription_list" v-model="selected_prescription" :option:selected="prescription_change()"></v-select>
      <label v-if="form_type < 2" for="description">Doctor's Notes:</label>
      <textarea v-if="form_type < 2" class="description" v-model="doctor_note" rows="3"></textarea>
      <p v-if="form_type < 2" class="divider"></p>
      <label v-if="form_type < 2" for="patient">Medicine:</label>
      <v-select v-if="form_type < 2" class="selector" id="patient" :options="list_of_medicine" v-model="selected_medicine"></v-select>
      <label v-if="form_type < 2" for="instructions">Instructions:</label>
      <textarea v-if="form_type < 2" id="instructions" class="description" v-model="dosage_instructions" rows="2"></textarea>
      <button v-if="form_type < 2" class="btn" type="button" v-on:click="add_medicine">Add Medicine</button>
      <p v-if="form_type < 2 && medicine_list.length > 0" class="divider"></p>
      <h6 v-if="form_type < 2 && medicine_list.length > 0">Prescription List</h6>
      <div v-if="form_type < 2 && medicine_list.length > 0" class="medicine">
        <div class="medicine-details" v-for="m in medicine_list" :key="m.code">
          <RouterLink class="special-hover-thing medicine-name" :to="'/medicine?id='+m.code" target="_blank">
            <b>{{ m.name }}</b>
          </RouterLink>
          <p class="medicine-instructions">
            <i style="justify-self: center;">Instruction:</i><br>
            {{ m.instruction }}
          </p>
          <p class="special-hover-thing delete-medicine" v-on:click="remove_medicine(m.code)">
            <u>Remove Prescription</u>
          </p>
        </div>
      </div>
      <p class="divider"></p>
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button v-if="form_type === 2" class="btn" type="submit">Delete Prescription</button>
      <button v-else-if="form_type === 1" class="btn" type="submit" disabled>Edit Prescription</button>
      <button v-else-if="form_type === 0" class="btn" type="submit">Write Prescription</button>
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
  width: 50em;
  max-width: 90vw;
  align-self: center;
  margin: 5em auto;
}
form > label {
  color: white;
  line-height: 1;
}

h2{
  align-self: center;
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

.medicine{
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  width: 100%;
  padding: 0 1em;
  justify-content: center;
}
.medicine-details{
  border: solid .1em white;
  border-radius: .1em;
  padding: .5em;
  display: grid;
  gap: .5em
}
.medicine-details > *{
  animation: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  justify-self: center;
}
.medicine-name{
  font-size: 1.1em;
}
.medicine-instructions{
  border-top: .1em solid white;
  border-bottom: .1em solid white;
  background-color: rgb(var(--color-contrast-dark));
  width: 100%;
  display: grid;
  padding: 0 .2em;
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
