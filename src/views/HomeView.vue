<script setup lang="ts">
import '@/assets/main.css'
</script>

<template>
  <main class="landing-screen">
    <h1 class="michroma-regular big-brand">
      The<br />
      Digital<br />
      Phonebook
    </h1>
  </main>
</template>

<style scoped>
.landing-screen {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding-top: 1em;
  left: 0;
  background-color: #8a3e24;
}

.big-brand {
  position: absolute;
  padding-left: 5vw;
  left: 0;
  color: white;
  font-size: 7vw;
  animation: fadeIn 2s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    top: 3rem;
  }
  100% {
    opacity: 1;
    top: 1rem;
  }
}
</style>
