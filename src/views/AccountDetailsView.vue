<script setup lang="ts">
import '@/assets/main.css'
import { useAccountStore } from '@/stores/account'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const acc_store = useAccountStore()
const route = useRoute()
let user_id = typeof route.query.uid === 'undefined' ? '' : (route.query.uid as string)

const acc_type = ref(-1),
name = ref(''),
id = ref(''),
shift_start = ref(''),
shift_end = ref(''),
contact_number = ref(''),
qualification_authority = ref(''),
qualification_expiry_date = ref(''),
works_in = ref(''),
specialises_in = ref(''),
nric = ref(''),
dob = ref(''),
place_of_residence = ref('')



onBeforeMount(() => {
  if(acc_store.signed_in && user_id === ""){
    user_id = acc_store.userid
  }
  if (user_id === acc_store.userid){
    fetch(`${BACKEND_URL}/get_account_details`, {
      method: "POST",
      headers: {
              "Content-type": "application/json; charset=UTF-8"
          },
      body: JSON.stringify({
        "userid" : acc_store.userid,
        "requester_id" : user_id,
        "session_key" : acc_store.session_key,
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
        acc_type.value = json_response["acc_type"]
        const data_tuple = json_response["data_tuple"]
        id.value = user_id
        if(acc_type.value === 0){
          name.value = data_tuple[3]
          contact_number.value = data_tuple[4]
          nric.value = data_tuple[1]
          place_of_residence.value = data_tuple[5]
          dob.value = data_tuple [2]
        }
        if(acc_type.value > 0){
          name.value = data_tuple[1]
          contact_number.value = data_tuple[4]
          shift_start.value = data_tuple[2]
          shift_end.value = data_tuple[3]
          if(acc_type.value < 3){
            qualification_authority.value = data_tuple[5]
            qualification_expiry_date.value = data_tuple[6]
            works_in.value = data_tuple[7]
          }
          else{
            works_in.value = data_tuple[5]
          }
          if(acc_type.value == 2){
            specialises_in.value = data_tuple[8]
          }
        }
      }
      else{
        acc_type.value = -1
      }
    })
    .catch(error => {
        console.log(error)
    })
  }
  else {
    console.log(user_id)
    fetch(`${BACKEND_URL}/get_account_details`, {
      method: "POST",
      headers: {
              "Content-type": "application/json; charset=UTF-8"
          },
      body: JSON.stringify({
        "requester_id" : acc_store.userid,
        "userid" : user_id ,
        "session_key" : acc_store.session_key,
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
        acc_type.value = json_response["acc_type"]
        const data_tuple = json_response["data_tuple"]
        id.value = user_id
        if(acc_type.value === 0){
          name.value = data_tuple[3]
          contact_number.value = data_tuple[4]
          nric.value = data_tuple[1]
          place_of_residence.value = data_tuple[5]
          dob.value = data_tuple [2]
        }
        if(acc_type.value > 0){
          name.value = data_tuple[1]
          contact_number.value = data_tuple[4]
          shift_start.value = data_tuple[2]
          shift_end.value = data_tuple[3]
          if(acc_type.value < 3){
            qualification_authority.value = data_tuple[5]
            qualification_expiry_date.value = data_tuple[6]
            works_in.value = data_tuple[7]
          }
          else{
            works_in.value = data_tuple[5]
          }
          if(acc_type.value == 2){
            specialises_in.value = data_tuple[8]
          }
        }
      }
      else{
        acc_type.value = -1
      }
    })
    .catch(error => {
        console.log(error)
    })
  }
})

</script>

<template>
  <main class="business-screen">
    <TopRightLogo/>
    <p v-if="!acc_store.signed_in" class="name-field">
      Sign in to see account details! Please return to the <RouterLink to="/">Home Page</RouterLink>
    </p>
    <p v-else-if="acc_store.userid !== user_id && acc_store.account_type < 1 && user_id[0] === 'P'" class="name-field">
      Patients are not allowed to see other users' data! Please return to the <RouterLink to="/">Home Page</RouterLink>
    </p>
    <div v-else style="display: contents" class="everything-container">
      <p class="name-field">{{ name }}</p>

      <img v-if="acc_type == 1"
        src="https://upload.wikimedia.org/wikipedia/en/0/0b/HouseGregoryHouse.png"
        class="user-image"
      />
      <img v-else-if="acc_type == 2"
        src="https://upload.wikimedia.org/wikipedia/en/8/80/Jameswilsonpromoseason6.jpg"
        class="user-image"
      />
      <img v-else-if="acc_type == 3"
        src="https://upload.wikimedia.org/wikipedia/en/0/03/Kal-penn-house.jpg"
        class="user-image"
      />
      <img v-else
        src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Resusci_Anne_-_CPR_dummy.jpg"
        class="user-image"
      >

      <div class="details">
        <p class="address">
          <img
            src="@/components/icons/globe.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          ID: {{ id }}
        </p>
        <p class="phone_number">
          <img
            src="@/components/icons/telephone_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ contact_number }}
        </p>
        <p v-if="acc_type > 0" class="department">
          <img
            src="@/components/icons/nextdoor.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ works_in }}
        </p>
        <p v-if="acc_type > 0" class="shift-timing">
          <img
            src="@/components/icons/clock.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ shift_start }} ~ {{ shift_end }}
        </p>
        <p v-if="acc_type == 2" class="specialty">
          <img
            src="@/components/icons/square_book_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ specialises_in }}
        </p>
      </div>

      <h4>Description:</h4>
      <p class="business-description">
        This is a Placeholder Description. Upholstery comes from the Middle English word upholder,
        which referred to an artisan who makes fabric furnishings. The term is equally applicable to
        domestic, automobile, airplane and boat furniture, and can be applied to mattresses,
        particularly the upper layers, though these often differ significantly in design. A person
        who works with upholstery is called an upholsterer. An apprentice upholsterer is sometimes
        called an outsider or trimmer. Traditional upholstery uses materials like coil springs
        (post-1850), animal hair (horse, hog and cow), coir, straw and hay, hessians, linen scrims,
        wadding, etc., and is done by hand, building each layer up. In contrast, today's
        upholsterers employ synthetic materials like dacron and vinyl, serpentine springs, and so
        on.
      </p>

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

.business-description {
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
