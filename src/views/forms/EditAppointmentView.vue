<script setup lang="ts">
import '@/assets/main.css'
import { onBeforeMount, ref, watch } from 'vue'
import { useAccountStore } from '@/stores/account'
//import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const acc_store = useAccountStore()
//const route = useRoute()

//universal
const form_type = ref(0)

const doctor_note = ref("")

const patient = ref({code : "", label : ""})
const list_of_patients = ref([{code : "", label : ""}])

const list_of_doctors = ref([{code : "", label : ""}])
const doctor = ref({code : "", label : ""})

const list_of_facilities = ref([])
const facility = ref("")

const datetime = ref("")

const treatment_list = ref([""])
const treatment = ref("")

const list_of_specialists = ref([{code : "", label : ""}])
const specialist = ref({code : "", label : ""})
const specialist_name_map = ref()

const appointment_treatments = ref()

const appointments_list = ref([{code:"", label:""}])
const appointment = ref({code:"", label:""})


const alertText = ref('')

onBeforeMount(() => {
  if(!acc_store.signed_in || acc_store.account_type > 1){
    return
  }
  form_change()
})

function edit_appointment(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  if(form_type.value===0 && (patient.value.code===""||doctor.value.code===""||datetime.value===""||facility.value==="")){
    alertText.value = "Please ensure the fields marked with an asterisk are filled in."
    return
  } else if (form_type.value===2 && appointment.value.code === "") {
    alertText.value = "Please ensure the fields marked with an asterisk are filled in."
    return
  }
  let mode = ""
  if(form_type.value === 2) mode = "delete"
  else if (form_type.value === 1) mode = "update"
  else mode = "add"
  fetch(`${BACKEND_URL}/edit_appointments`, {
    method: "POST",
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : acc_store.account_type===0 ? acc_store.userid : patient.value.code,
      "doctor_id": doctor.value.code,
      "date_time": datetime.value,
      "notes": doctor_note.value,
      "facility_name": facility.value,
      "treatments": appointment_treatments.value,
      "appointment_id": appointment.value.code,
      "mode" : mode,
      "additional": "update"
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
    form_change(true)
  })
  .catch(error => {
      console.log(error)
  })
}

function get_patients(when_done? : () => void | undefined){
  if(acc_store.userid[0] === 'P'){
    list_of_patients.value = [{code : acc_store.userid, label : acc_store.userid+' : '+acc_store.username}]
    if(when_done!==undefined)when_done()
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

function get_doctors(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_doctors`, {
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
      list_of_doctors.value = []
      for (const p of json_response['list']){
        list_of_doctors.value = list_of_doctors.value.concat({code : 'S'+p[0], label : 'S'+p[0]+' : '+p[1]})
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

function get_departments(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_departments`, {
      method: "POST",
      body: JSON.stringify({
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
        list_of_facilities.value = []
        for (const p of json_response['list']){
          list_of_facilities.value = list_of_facilities.value.concat(p[0])
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

function get_specialists(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_specialists`, {
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
      list_of_specialists.value = [{code:"", label:"None Selected"}]
      specialist_name_map.value = {}
      for (const p of json_response['list']){
        list_of_specialists.value = list_of_specialists.value.concat({code : p[0], label : 'S'+p[0]+' : '+p[1]})
        specialist_name_map.value[p[0]] = p[1]
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

function get_treatments(when_done? : ()=>void | undefined){
  fetch(`${BACKEND_URL}/get_treatments`, {
    method: "POST",
    body: JSON.stringify({
      "start_from" : 0,
      "num_results" : 999,
      "search_text": "%",
      "exact_match" : false
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
    treatment_list.value = []
    if(json_response["request_success"]) {
      for (const i of json_response["list"])
        treatment_list.value = treatment_list.value.concat(i[0])
    }
    if(when_done!==undefined) when_done()
  })
  .catch(error => {
      console.log(error)
      return error
  })
}

function get_appointments(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_appointments`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : acc_store.account_type===0 ? acc_store.userid : "",
      "doctor_id" : "",
      "future_only" : false,
      "past_only": false
    })
  })
  .then((response) => {
    if(!response.ok) return Promise.reject(response)
    else return response.text()
  })
  .then((json_text : string) => {
    const json_response = JSON.parse(json_text)
    appointments_list.value = []
    if(json_response["request_success"]) {
      console.log(json_response["list"])
      for (const i of json_response["list"]) {
        appointments_list.value = appointments_list.value.concat({
          code: i[0],
          label: "Appt" + i[0] + ' @ ' + i[1] + ' (Doc: S' + i[3] + ')'
        })
        //console.log(appointments_list.value)
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

watch(appointment, () => {
  getSet()
})

function getSet(when_done? : () => void | undefined) {
  fetch(`${BACKEND_URL}/get_appointments`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : acc_store.account_type===0 ? acc_store.userid : "",
      "doctor_id" : "",
      "future_only" : false,
      "past_only": false,
      "appointment_id": appointment.value.code
    })
  })
    .then((response) => {
      if(!response.ok) return Promise.reject(response)
      else return response.text()
    })
    .then((json_text : string) => {
      const json_response = JSON.parse(json_text)
      console.log("response")
      console.log(json_response)
      if(json_response["request_success"]) {
        if (form_type.value === 1 && appointment.value.code != "") {
          appointment_treatments.value = {}
          doctor_note.value = json_response["list"][2]
          // need a for each
          for (const i of json_response["list"][8]) {
            console.log(i)
            if (i[1] in appointment_treatments.value) {
              appointment_treatments.value[i[1]] = appointment_treatments.value[i[1]].concat([i[2]])
            } else {
              appointment_treatments.value[i[1]] = [i[2]]
            }
          }
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

function add_treatment(){
  alertText.value = ""
  if(treatment.value == ""){
    alertText.value = "Please select a treatment to add it."
    return
  }
  if(treatment.value in appointment_treatments.value){
    if(specialist.value.code!=="")
      if (!(specialist.value.code in appointment_treatments.value[treatment.value]))
        appointment_treatments.value[treatment.value] = appointment_treatments.value[treatment.value].concat(specialist.value.code);
      else
        alertText.value="The specialist is already assigned to this treatment"
  } else {
    appointment_treatments.value[treatment.value] = [specialist.value.code]
  }
}

function remove_treatment(treatment_name : string){
  delete appointment_treatments.value[treatment_name]
}

function form_change(retain_alertText?:boolean|undefined){
  list_of_patients.value = []
  list_of_doctors.value = []
  treatment_list.value = []
  list_of_specialists.value = []
  appointment_treatments.value = {}
  patient.value = {code : "", label : ""}
  doctor.value = {code : "", label : ""}
  specialist.value = {code : "", label : ""}
  treatment.value = ""
  if(retain_alertText===undefined||retain_alertText===false)alertText.value = ""
  appointment.value = {code:"", label:""}
  if(form_type.value === 2){
    //delete
    get_appointments()
  }
  else if (form_type.value === 1){
    //edit
    get_appointments()
    get_patients(() => get_doctors(()=>get_specialists(()=>get_treatments(()=>get_departments()))))
  } else {
    //add
    get_patients(() => get_doctors(()=>get_specialists(()=>get_treatments(()=>get_departments()))))
  }
}
</script>

<template>
  <main>
    <TopRightLogo/>

    <h1 class="not-staff" v-if="!acc_store.signed_in || acc_store.account_type > 1">Sign in as doctor or patient to create new appointment.</h1>
    <form role="form" v-on:submit="edit_appointment" v-else>
      <h2>Appointment Form</h2>
      <div class="formselector">
        <input id="add" name="formtype" type="radio" :value=0 v-model="form_type" v-on:change="form_change" checked/>
        <label for="add">Add </label>
        <p></p>
        <input id="update" name="formtype" type="radio" :value=1 v-model="form_type" v-on:change="form_change"/>
        <label for="update">Update </label>
        <p></p>
        <input id="delete" name="formtype" type="radio" :value=2 v-model="form_type" v-on:change="form_change"/>
        <label for="delete">Delete </label>
      </div>

      <label v-if="form_type > 0" for="appointment">*Appointment:</label>
      <v-select v-if="form_type > 0" class="selector" id="appointment" :options="appointments_list" v-model="appointment" v-on:input="getSet"></v-select>

      <label v-if="form_type===0" for="patient">*Patient:</label>
      <v-select v-if="form_type===0" class="selector" id="patient" :options="list_of_patients" v-model="patient"></v-select>

      <label v-if="form_type===0" for="doctor">*Doctor:</label>
      <v-select v-if="form_type===0" class="selector" id="doctor" :options="list_of_doctors" v-model="doctor"></v-select>

      <label v-if="form_type < 2" for="description">Doctor's Notes:</label>
      <textarea v-if="form_type < 2" class="description" v-model="doctor_note" rows="3" :disabled="acc_store.account_type==0"></textarea>

      <label v-if="form_type===0" for="datetime">*Date & Time:</label>
      <input v-if="form_type===0" class="selector" id="datetime" v-model="datetime" type="datetime-local">

      <label v-if="form_type===0" for="facility">*Facility:</label>
      <v-select v-if="form_type===0" class="selector" id="facility" :options="list_of_facilities" v-model="facility"></v-select>

      <p v-if="form_type < 2" class="divider"></p>

      <label v-if="form_type < 2" for="treatment">Treatment:</label>
      <v-select v-if="form_type < 2" class="selector" id="treatment" :options="treatment_list" v-model="treatment"></v-select>

      <label v-if="form_type < 2" for="specialist">Specialist:</label>
      <v-select v-if="form_type < 2" class="selector" id="specialist" :options="list_of_specialists" v-model="specialist"></v-select>

      <button v-if="form_type < 2" class="btn" type="button" v-on:click="add_treatment">Add Treatment</button>

      <p v-if="form_type < 2 && treatment_list.length > 0" class="divider"></p>

      <h6 v-if="form_type < 2 && (appointment_treatments===undefined || Object.keys(appointment_treatments).length > 0)">Treatment List</h6>
      <div v-if="form_type < 2 && (appointment_treatments===undefined || Object.keys(appointment_treatments).length > 0)" class="medicine">
        <div class="medicine-details" v-for="(value, key) in appointment_treatments" :key="key">
          <RouterLink class="special-hover-thing medicine-name" :to="'/treatment?id='+key" target="_blank">
            <b>{{ key }}</b>
          </RouterLink>
          <div class="medicine-instructions">
            <i style="justify-self: center;">Specialists:</i><br>
            <li v-for="v in value" :key="v">
              {{ specialist_name_map[v] }}
            </li>
          </div>
          <p class="special-hover-thing delete-medicine" v-on:click="remove_treatment(key.toString())">
            <u>Remove Treatment</u>
          </p>
        </div>
      </div>

      <p class="divider"></p>

      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button v-if="form_type === 2" class="btn" type="submit">Delete Appointment</button>
      <button v-else-if="form_type === 1" class="btn" type="submit">Edit Appointment</button>
      <button v-else-if="form_type === 0" class="btn" type="submit">Make Appointment</button>
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
  padding: 0 1em;
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
