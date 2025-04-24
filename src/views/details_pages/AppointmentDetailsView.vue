<script setup lang="ts">
import '@/assets/main.css'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'
import { useAccountStore } from '@/stores/account'
import TreatmentSpecialistResult from '@/components/TreatmentSpecialistResult.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const route = useRoute()
const query_id = typeof route.query.id === 'undefined' ? '' : (route.query.id as string)
const acc_store = useAccountStore()
const title = ref(''),
datetime = ref(''),
doctor_id = ref(''),
appointment_notes = ref(''),
facility_name = ref(''),
doctor_name = ref(''),
patient_id = ref(''),
patient_name = ref(''),
treatments_list = ref([])

onBeforeMount(() => {
  if(!acc_store.signed_in || query_id==="") return;
  fetch(`${BACKEND_URL}/get_appointments`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "appointment_id" : query_id
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
      const data = json_response["list"]
      title.value = "Appointment #"+data[0]
      datetime.value = data[1]
      appointment_notes.value = data[2]
      doctor_id.value = data[3]
      facility_name.value = data[4]
      patient_id.value = data[5]
      patient_name.value = data[6]
      doctor_name.value = data[7]
      treatments_list.value = data[8] // [[appointment_id, treatment_name, specialist_id, specialist_name]]
    }
  })
  .catch(error => {
      console.log(error)
  })
})

</script>

<template>
  <main class="business-screen">
    <TopRightLogo/>
    <p v-if="query_id === ''" class="name-field">
      No appointment in URL query!
    </p>
    <div v-else style="display: contents" class="everything-container">
      <p class="name-field">{{ title }}</p>
      <div class="details">
        <p class="medicine-id">
          <img
            src="@/components/icons/globe.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          Scheduled for {{ datetime }}
        </p>
        <p class="quantity">
          <img
            src="@/components/icons/nextdoor.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          Department: {{ facility_name }}
        </p>
        <p class="quantity">
          <img
            src="@/components/icons/telephone_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          Doctor: {{ doctor_name }}
        </p>
        <p class="quantity">
          <img
            src="@/components/icons/telephone_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          Patient: {{ patient_name }}
        </p>
      </div>

      <h4>Appointment notes:</h4>
      <p class="notes">{{ appointment_notes }}</p>

      <h4>Treatments Scheduled:</h4>
      <div
        class="treatments-list-container"
        v-if="treatments_list.length > 0"
        ref="treatments_list_container"
      >
        <li v-for="t in treatments_list" :key="t">
          <TreatmentSpecialistResult
            :name="t[1]"
            :specialist_id="t[2]"
            :specialist_name="t[3]"
            class="treatments-results"
          />
        </li>
      </div>
      <p class="notes" v-else>No Treatments Scheduled</p>

    </div>
  </main>
</template>

<style scoped>
.business-screen {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 2em 5vw;
  left: 0;
  background-color: rgb(var(--color-main-3));
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  overflow: auto;
}

.big-brand {
  position: relative;
  left: 0;
  color: goldenrod;
  font-size: 1.5em;
  margin: 0;
  opacity: 0;
  animation: brandFadeIn 0.5s ease-out 0s normal forwards !important;
}

.name-field {
  font-size: 3em;
  margin: 0 auto;
}

.user-image {
  max-width: 80vw;
  max-height: 30em;
  margin: 0 auto;
  object-fit: contain;
}

.details {
  display: flex;
  padding: 0.5em 2em;
  flex-direction: column;
  background: rgb(var(--color-main-2));
  border-radius: 0.5em;
  font-size: 1.3em;
  gap: 0.5em;
}
.details > p {
  margin: 0;
  font-weight: 400;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
  margin-top: auto;
  margin-bottom: auto;
}

.favourite-button {
  display: flex;
  padding: 0.5em 2em;
  flex-direction: column;
  background: rgb(var(--color-contrast-dark));
  border-radius: 0.5em;
  font-size: 1.1em;
  text-decoration: underline;
  width: fit-content;
  transition: all 0.3s;
  text-underline-offset: 0.1em;
}
.favourite-button:hover {
  filter: brightness(120%);
  text-underline-offset: 0.25em;
}

.notes {
  font-size: 1.2em;
}

.name-field,
.user-image,
.details,
.favourite-button-container,
.business-description {
  opacity: 0;
  animation: textFadeIn 0.5s ease-out 0.5s normal forwards !important;
}

.treatments-list-container {
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 0;
  margin: 0 auto;
  width: 85vw;
  scrollbar-width: thin;
  font-size: 1.1em;
  padding: 0.5em 0;
  border-top: 0.1em solid white;
  border-bottom: 0.1em solid white;
  list-style-type: none;
}
.treatments-results {
  color: white;
  grid-row-gap: 1.2em;
  padding: 1.2em 0;
}

@keyframes brandFadeIn {
  0% {
    opacity: 0;
    top: 0.5em;
  }
  100% {
    opacity: 1;
    top: 0em;
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

@keyframes cardsFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
