<script setup lang="ts">
import '@/assets/main.css'
import { useAccountStore } from '@/stores/account'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const acc_store = useAccountStore()
const route = useRoute()
const router = useRouter()
const query_id = typeof route.query.id === 'undefined' ? '' : (route.query.id as string)

const id = ref(''),
prescription_date = ref(''),
doctor_name = ref(''),
doctor_id = ref(''),
dispensation_date = ref(''),
pharmacist_name = ref(''),
pharmacist_id = ref(''),
patient_name = ref(''),
patient_id = ref(''),
prescription_id = ref('')

onBeforeMount(() => {

})

function dispense(){

}

</script>

<template>
  <main class="business-screen">
    <TopRightLogo/>
    <p v-if="query_id === ''" class="name-field">
      No prescription in URL query! Please select a medication from <RouterLink to="/medicine_search">Medication Search Page</RouterLink>
    </p>
    <div v-else style="display: contents" class="everything-container">
      <p class="name-field">{{ name }}</p>

      <div class="details">
        <p class="medicine-id">
          <img
            src="@/components/icons/globe.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          ID: {{ id }}
        </p>
        <p class="quantity">
          <img
            src="@/components/icons/square_book_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          Quantity: {{ quantity }}
        </p>
      </div>

      <div class="favourite-button-container">
        <p
          v-if="acc_store.signed_in && acc_store.userid[0] === 'P' && !isAllergic"
          class="favourite-button"
          name="favourite-button"
          v-on:click="toggleAllergy"
        >
          Add as allergy
        </p>
        <p
          v-if="acc_store.signed_in && acc_store.userid[0] === 'P' && isAllergic"
          class="favourite-button"
          name="favourite-button"
          v-on:click="toggleAllergy"
        >
          Remove allergy
        </p>
        <p
          v-if="acc_store.signed_in && acc_store.account_type === 3"
          class="favourite-button"
          name="favourite-button"
          v-on:click="router.push({name : 'edit_medicine'})"
        >
          Dispense/Restock
        </p>
      </div>
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
