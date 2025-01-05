<script setup lang="ts">
import '@/assets/main.css'
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useRouter } from 'vue-router'

const acc_store = useAccountStore()
const router = useRouter()
const username_input = ref('')
const password_input = ref('')
const alertText = ref('')

function sign_in(event: { preventDefault: () => void }) {
  alertText.value = ''
  event.preventDefault()
  if (username_input.value === '') {
    alertText.value = 'Username field was left blank.'
  } else {
    acc_store.sign_in(username_input.value)
    router.push({ name: 'home' })
  }
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
      <label for="username">Username:</label>
      <input id="username" type="text" placeholder="Username" v-model="username_input" />
      <label for="password">Password:</label>
      <input id="password" type="password" placeholder="" v-model="password_input" />
      <p v-if="alertText !== ''">
        {{ alertText }}
      </p>
      <div v-else class="p"></div>
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
  background-color: rgb(var(--color-main-3));
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
