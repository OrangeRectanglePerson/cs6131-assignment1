<script setup lang="ts">
import '@/assets/main.css'
import AppointmentSearchResult from '@/components/AppointmentSearchResult.vue'
import { useAccountStore } from '@/stores/account'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const acc_store = useAccountStore()
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

defineProps({
  force_name: {
    type: String,
    required: false,
  },
})

// composition: appointment_id, doctor_name, patient_name, facility_name, date, [treatment_name, non_consulting_specialist]
const appointments_list = ref()

onMounted(() => {
  get_appointments()
})

function get_appointments(when_done? : () => void | undefined){
  fetch(`${BACKEND_URL}/get_appointments`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "patient_id" : acc_store.account_type === 0 ? acc_store.userid : "",
      "doctor_id" : acc_store.account_type === 1 ? acc_store.userid : "",
      "future_only" : true
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
      for (const i of json_response["list"]){
        appointments_list.value = appointments_list.value.concat([[i[0], i[7], i[6], i[4], i[1], []]])
        console.log(appointments_list.value)
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

</script>

<template>
  <main class="landing-screen">
    <h1 class="michroma-regular big-brand">
      Patient Data<br />
      Management<br />
      System
    </h1>

    <p v-if="acc_store.signed_in && force_name === undefined">
      Welcome,
      <RouterLink to="/account" class="account-name" id="offcanvasNavbarLabel">{{
        acc_store.username
      }}</RouterLink>
    </p>
    <p v-else-if="force_name !== undefined">Welcome, {{ force_name }} (Forced Welcome. You are not signed in.)</p>
    <p v-else>To force a welcome message to appear, use route <span style="font-family: monospace;">/welcome/&lt;name&gt;</span></p>

    <p v-if="(acc_store.account_type===0 || acc_store.account_type===1) && acc_store.signed_in">
      Future Appointments:
    </p>
      <div
        class="appointment-list-container"
        v-if="(acc_store.account_type===0 || acc_store.account_type===1) && appointments_list.length > 0 && acc_store.signed_in"
        ref="appointment-list-container"
      >
        <li v-for="a in appointments_list" :key="a[0]">
          <AppointmentSearchResult
            :consultation_id = "a[0]"
            :doctor_name="a[1]"
            :patient_name="a[2]"
            :facility_name="a[3]"
            :date_time="a[4]"
            class="appointment"
          />
        </li>
      </div>
      <h5
      class="appointment-list-container"
      v-else-if="(acc_store.account_type===0 || acc_store.account_type===1) && acc_store.signed_in">
        No Upcoming Appointments
      </h5>
  </main>
</template>

<style scoped>
.landing-screen {
  top: 0;
  position: absolute;
  width: 100%;
  min-height: 100vh;
  padding-top: 2em;
  padding-left: 5vw;
  padding-bottom: 2em;
  left: 0;
  background-color: rgb(var(--color-main-3));
  display: flex;
  flex-direction: column;
  row-gap: 2em;
}

.big-brand {
  position: relative;
  left: 0;
  color: goldenrod;
  font-size: 7vw;
  opacity: 0;
  margin: 0;
  animation: brandFadeIn 1s ease-out 0s normal forwards !important;
  width: fit-content;
}

p {
  font-size: 1.5em;
  color: white;
  margin: 0;
  opacity: 0;
  width: fit-content;
  animation: textFadeIn 1s ease-out 1s normal forwards !important;
}

.searchbar {
  font-size: 1em;
  width: 50em;
  max-width: 80vw;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards !important;
}
.btn {
  transition: 0.3s;
  padding: 0 1em;
  color: black !important;
  background-color: rgb(var(--color-contrast-light)) !important;
}
.btn:hover {
  filter: brightness(125%);
  transition: 0.3s;
}

.appointment-list-container {
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 0;
  margin: 0;
  width: 85vw;
  scrollbar-width: thin;
  font-size: 1em;
  padding: 0.5em 0;
  border-top: 0.1em solid white;
  border-bottom: 0.1em solid white;
  list-style-type: none;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards !important;
}
.appointment {
  color: white;
  grid-row-gap: 1.2em;
}

@keyframes brandFadeIn {
  0% {
    opacity: 0;
    margin-top: 2rem;
  }
  100% {
    opacity: 1;
    margin-top: 0rem;
  }
}

@keyframes textFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
