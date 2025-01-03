<script setup lang="ts">
import '@/assets/main.css'
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useRouter } from 'vue-router'

const acc_store = useAccountStore()
const router = useRouter()
const username_input = ref('')

function sign_in(event: { preventDefault: () => void }) {
  event.preventDefault()
  acc_store.sign_in(username_input.value)
  router.push({ name: 'home' })
}
</script>

<template>
  <main>
    <h1 class="brand" v-on:click="router.push({ name: 'home' })" type="button">
      The<br />
      Digital<br />
      Phonebook
    </h1>
    <form role="form" v-on:submit="sign_in">
      <label for="username">Username:</label><br />
      <input
        class="username_field"
        id="username"
        type="text"
        placeholder="Username"
        v-model="username_input"
      /><br />
      <button class="btn" type="submit">Sign In</button>
    </form>
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
  background-color: var(--color-main-3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.brand {
  position: relative;
  padding-left: 1em;
  left: 0;
  width: fit-content;
  color: goldenrod;
  font-size: 1em;
  opacity: 0;
  animation: brandFadeIn 1s ease-out 0s normal forwards !important;
  height: fit-content;
  font-family: 'Michroma', 'Jura', sans-serif;
}

form {
  gap: 0.5em;
  display: flex;
  flex-direction: column;
  width: 20em;
  max-width: 90vw;
  align-self: center;
  margin: auto;
}

.btn {
  transition: 0.3s;
  padding: 0 1em;
  color: black !important;
  background-color: var(--color-contrast-light) !important;
  width: fit-content;
  align-self: center;
}
.btn:hover {
  filter: brightness(85%);
  transition: 0.3s;
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
