<script setup lang="ts">
import '@/assets/main.css'
import { onBeforeMount, ref } from 'vue'
import { useAccountStore } from '@/stores/account'
//import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const acc_store = useAccountStore()
//const route = useRoute()

const department_list = ref([])
const selected_department = ref("")
const edited_id = ref({code : "", label : ""})
const alertText = ref('')

onBeforeMount(() => {
  fetch(`${BACKEND_URL}/get_departments`, {
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
        department_list.value = department_list.value.concat(i[0])
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
  return fetch(`${BACKEND_URL}/edit_staff_department`, {
        method: "POST",
        body: JSON.stringify({
          "editor_id" : acc_store.userid,
          "editor_session_key" : acc_store.session_key,
          "edited_id" : edited_id.value.code,
          "department" : selected_department.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })  .then((response) => {
              if(!response.ok) return Promise.reject(response)
              else return response.text()
          })
          .then((json_text : string) => {
            const json_response = JSON.parse(json_text)
            console.log(json_response)
            if(json_response["request_success"]) {
              alertText.value = "Department Successfully Edited"
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
    <form role="form" v-on:submit="edit_account" v-else-if="acc_store.userid[0]==='S'">
      <h2>Staff Department Form</h2>
      <label for="name">Employee to edit:</label>
      <v-select class="selector" id="name" :options="[{label : acc_store.username, code : acc_store.userid}]" v-model="edited_id"></v-select>
      <label for="department">Department:</label>
      <v-select class="selector" id="departent" :options="department_list" v-model="selected_department"></v-select>
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
      <button class="btn" type="submit">Change Department</button>
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
