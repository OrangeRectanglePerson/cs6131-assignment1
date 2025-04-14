<script setup lang="ts">
import '@/assets/main.css'
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { RouterLink, useRouter } from 'vue-router'

const acc_store = useAccountStore()
const search_query = ref('')
const router = useRouter()

function search(event: { preventDefault: () => void }) {
  event.preventDefault()
  router.push({ name: 'search', query: { search_query: search_query.value } })
}

defineProps({
  force_name: {
    type: String,
    required: false,
  },
})
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
    <form class="d-flex searchbar" role="search" v-on:submit="search">
      <input
        class="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        v-model="search_query"
      />
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </main>
</template>

<style scoped>
.landing-screen {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding-top: 2em;
  padding-left: 5vw;
  left: 0;
  background-color: rgb(var(--color-main-3));
  display: flex;
  flex-direction: column;
  gap: 3em;
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
