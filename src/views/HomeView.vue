<script setup lang="ts">
import '@/assets/main.css'
import { useAccountStore } from '@/stores/account'

const acc_store = useAccountStore()
</script>

<template>
  <main class="landing-screen">
    <h1 class="michroma-regular big-brand">
      The<br />
      Digital<br />
      Phonebook
    </h1>
    <p v-if="acc_store.signed_in">Welcome, {{ acc_store.username }}</p>
  </main>
</template>

<style scoped>
.landing-screen {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding-top: 1em;
  padding-left: 5vw;
  left: 0;
  background-color: var(--color-main-3);
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.big-brand {
  position: relative;
  left: 0;
  color: goldenrod;
  font-size: 7vw;
  opacity: 0;
  animation: brandFadeIn 2s ease-out 0s normal forwards !important;
}

p {
  font-size: 1.5em;
  color: white;
  opacity: 0;
  animation: textFadeIn 1s ease-out 2s normal forwards !important;
}

@keyframes brandFadeIn {
  0% {
    opacity: 0;
    top: 3rem;
  }
  100% {
    opacity: 1;
    top: 1rem;
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
