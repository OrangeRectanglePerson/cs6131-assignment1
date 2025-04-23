<script setup lang="ts">
import '@/assets/main.css'
import { onBeforeMount, ref } from 'vue'
import { useAccountStore } from '@/stores/account'
//import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const acc_store = useAccountStore()
//const route = useRoute()

const treatment_list = ref(["No Specialisation"])
const selected_treatment = ref("")
const edited_id = ref({code : "", label : ""})
const alertText = ref('')

onBeforeMount(() => {
  fetch(`${BACKEND_URL}/get_treatments`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "start_from" : 0,
      "num_results" : 999,
      "search_text" : "%",
      "exact_match" : false
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
      for (const i of json_response["list"]){
        treatment_list.value = treatment_list.value.concat(i[0])
      }

    }
    alertText.value = "Select the appropriate values."
  })
  .catch(error => {
      console.log(error)
  })
})

function edit_account(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  return fetch(`${BACKEND_URL}/edit_specialisation`, {
    method: "POST",
    body: JSON.stringify({
      "userid" : edited_id.value.code,
      "session_key" : acc_store.session_key,
      "edited_id" : edited_id.value.code,
      "specialty" : selected_treatment.value==="No Specialisation" ? null : selected_treatment.value
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
      alertText.value = "Specialisation Successfully Edited"
    }
    else{
      alertText.value = "Something went wrong"
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
    <form role="form" v-on:submit="edit_account" v-else-if="acc_store.account_type === 2">
      <!-- Common -->
      <label for="name">Employee to edit:</label>
      <v-select class="selector" id="name" :options="[{label : acc_store.username, code : acc_store.userid}]" v-model="edited_id"></v-select>
      <label for="treatment">Treatment:</label>
      <v-select class="selector" id="treatment" :options="treatment_list" v-model="selected_treatment"></v-select>
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button class="btn" type="submit">Change Specialisation</button>
    </form>
    <h1 class="not-staff" v-else>Only specialists can edit their specialisations</h1>

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
