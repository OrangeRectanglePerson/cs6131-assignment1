<script setup lang="ts">
import '@/assets/main.css'
import { useAccountStore } from '@/stores/account'
import { useRouter } from 'vue-router'
import AccountCard from '@/components/AccountCard.vue'

const acc_store = useAccountStore()
const router = useRouter()
</script>

<template>
  <main class="account-screen">
    <h1 class="michroma-regular big-brand" v-on:click="router.push({ name: 'home' })" type="button">
      The<br />
      Digital<br />
      Phonebook
    </h1>
    <p v-if="acc_store.signed_in" class="welcome">Welcome, {{ acc_store.username }}</p>
    <div class="account-cards" v-if="acc_store.signed_in">
      <AccountCard
        title="Change Password"
        to="/"
        description="Change account passsword"
        footnote=""
        class="AccountCard"
      />
      <AccountCard
        title="Edit Entries"
        to="/"
        description="Edit database entries"
        footnote="Admin Command"
        class="AccountCard"
      />
      <AccountCard
        title="Edit Account Permissions"
        to="/"
        description="Edit the permissions given to users of the website"
        footnote="Moderator Command"
        class="AccountCard"
      />
      <AccountCard
        title="Server Maintenance"
        to="/"
        description="View server statistics and perform basic automated tasks"
        footnote="Server Admin Command"
        class="AccountCard"
      />
      <AccountCard
        image="/Radiation_warning_symbol.svg"
        title="Launch the Nukes"
        to="/"
        description="You know you wanna do it"
        footnote="Presidential Command"
        class="AccountCard"
      />
    </div>

    <RouterLink v-else class="sign-in-reminder" to="/sign_in">Please Sign In First</RouterLink>
  </main>
</template>

<style scoped>
.account-screen {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 2em 5vw;
  left: 0;
  background-color: rgb(var(--color-contrast-dark));
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  overflow: auto;
}

.big-brand {
  position: relative;
  left: 0;
  color: goldenrod;
  font-size: 2em;
  margin: 0;
  opacity: 0;
  animation: brandFadeIn 1s ease-out 0s normal forwards !important;
}

.welcome {
  font-size: 3em;
  margin: 0;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards !important;
}

.account-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  width: 100%;
}

.AccountCard {
  width: 20em;
  max-width: 100%;
  opacity: 0;
  animation: cardsFadeIn 1s ease-out 2s normal forwards !important;
}

.sign-in-reminder {
  font-size: 2em;
  opacity: 0;
  color: white;
  width: fit-content;
  animation: textFadeIn 1s ease-out 1s normal forwards !important;
}

@keyframes brandFadeIn {
  0% {
    opacity: 0;
    top: 2rem;
  }
  100% {
    opacity: 1;
    top: 0rem;
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
