<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { onMounted, ref } from 'vue';

const props = defineProps({
  prescription_date: String,
  doctor_name: String,
  doctor_id: String,
  dispensation_date_prop: {
    type : String,
    default : "Not Yet Dispensed"
  },
  pharmacist_name_prop: {
    type : String,
    default : "Not Yet Dispensed"
  },
  pharmacist_id_prop: {
    type : String,
    default : ""
  },
  patient_name: String,
  patient_id: String,
  prescription_id : String
})

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const acc_store = useAccountStore()
const medicine_list = ref([])

const dispensation_date = ref(props.dispensation_date_prop)
const pharmacist_name = ref(props.pharmacist_name_prop)
const pharmacist_id = ref(props.pharmacist_id_prop)

onMounted(() => {
  getMedicine()
})

function getMedicine(when_done? : (() => void)|undefined){
  fetch(`${BACKEND_URL}/get_prescription_amounts`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "prescription_id" : props.prescription_id,
    })
  })
  .then((response) => {
    if(!response.ok) return Promise.reject(response)
    else return response.text()
  })
  .then((json_text : string) => {
    const json_response = JSON.parse(json_text)
    if(json_response["request_success"]) {
      medicine_list.value = json_response["list"]
    }
    if (when_done !== undefined){
      when_done()
    }
  })
  .catch(error => {
      console.log(error)
  })
}

function dispense(){
  fetch(`${BACKEND_URL}/dispense_prescription`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "requester_id" : acc_store.userid,
      "session_key" : acc_store.session_key,
      "prescription_id" : props.prescription_id,
    })
  })
  .then((response) => {
    if(!response.ok) return Promise.reject(response)
    else return response.text()
  })
  .then((json_text : string) => {
    const json_response = JSON.parse(json_text)
    if(json_response["request_success"]) {
      pharmacist_id.value = json_response["list"][0][0]
      dispensation_date.value = json_response["list"][0][1]
      pharmacist_name.value = json_response["list"][0][2]
    }
  })
  .catch(error => {
      console.log(error)
  })
}

</script>

<template>
  <div class="search-result-container">

    <div style="display: grid; width: 100%">
      <RouterLink class="name" >
        Prescription #{{ prescription_id }}
      </RouterLink>
      <div class="details">
        <p class="address">
          <img src="./icons/nextdoor.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Doctor: <u>{{ doctor_name }}</u> (S{{ doctor_id }})
        </p>
        <p class="website">
          <img src="./icons/nextdoor.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Patient: <u>{{ patient_name }}</u> (P{{ patient_id }})
        </p>
        <p class="website">
          <img src="./icons/globe.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Prescription Date: <u>{{ prescription_date }}</u>
        </p>
        <p class="website">
          <img src="./icons/globe.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Dispensation Date: <u>{{ dispensation_date }}</u>
        </p>
        <p class="website">
          <img src="./icons/nextdoor.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Pharmacist: <u>{{ pharmacist_name }}</u> (S{{ pharmacist_id }})
        </p>
        <p
          v-if="acc_store.signed_in && acc_store.account_type === 3 && pharmacist_id === ''"
          class="favourite-button"
          name="favourite-button"
          v-on:click="dispense"
        >
          Dispense
        </p>
      </div>
      <div class="medicine">
        <div class="medicine-details" v-for="m in medicine_list" :key="m">
          <RouterLink class="special-hover-thing" :to="'/medicine?id='+m[0]">{{ m[3] }}</RouterLink>
          <p>Amt: {{ m[2] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-result-container {
  display: flex;
  flex-direction: row;
  border: solid;
  border-width: 1px 0;
  border-image: linear-gradient(to right, transparent 0%, white 10% 90%, transparent 100%) 1;
  grid-row-gap: 1em;
  padding: 1em 0;
  padding-inline-start: 2em;
}

.name {
  padding: 0 1em;
  margin: 0;
  font-weight: 400;
  font-size: 1.25em;
  line-height: 1;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 0.2em;
  color: white;
  align-content: center;
  transition: all 0.3s;
  text-underline-offset: 0.1em;
}
.special-hover-thing:hover, .name:hover {
  background-color: rgb(var(--color-main-2));
  text-underline-offset: 0.25em;
}
.details {
  display: flex;
  padding: 0 1em 0 2em;
  flex-direction: column;
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
  margin-top: .5em !important;
  padding: 0.25em 1em;
  flex-direction: column;
  background: rgb(var(--color-contrast-dark));
  border-radius: 0.5em;
  font-size: 1em;
  text-decoration: underline;
  width: fit-content;
  transition: all 0.3s;
  text-underline-offset: 0.1em;
}
.favourite-button:hover {
  filter: brightness(120%);
  text-underline-offset: 0.25em;
}

.search_result_image {
  max-height: 6em;
  max-width: 9em;
  left: 0;
  margin: 0 2em 0 2em;
  grid-column: 2;
  grid-row: 1;
}

.medicine{
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  width: 100%;
  padding: 0 1em;
}
.medicine-details{
  border: solid .1em white;
  border-radius: .1em;
  padding: .5em;
}
.medicine-details > *{
  padding: 0;
  margin: 0;
}

@media (max-width: 100vh) {
  .search-result-container {
    flex-direction: column;
  }
  .name {
    text-align: center;
  }
  .details {
    grid-auto-flow: row;
  }
  .search_result_image {
    max-width: 80vw;
  }
}
</style>
