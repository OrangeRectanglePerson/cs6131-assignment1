<script setup lang="ts">
import '@/assets/main.css'
import { useAccountStore } from '@/stores/account'
import { useRouter } from 'vue-router'
import AccountCard from '@/components/AccountCard.vue'

const acc_store = useAccountStore()
const router = useRouter()
const _BASE_URL = import.meta.env.BASE_URL
</script>

<template>
  <main class="account-screen">
    <h1 class="michroma-regular big-brand" v-on:click="router.push({ name: 'home' })" type="button">
      Patient Data<br />
      Management<br />
      System
    </h1>
    <p v-if="acc_store.signed_in" class="welcome">Welcome, {{ acc_store.username }}</p>
    <div class="account-cards" v-if="acc_store.signed_in">
      <AccountCard
        :image="_BASE_URL + 'icons/square_book_icon.svg'"
        title="Account Details"
        :to="'/account_details?uid='+acc_store.userid"
        description="View details of your account"
        footnote=""
        class="AccountCard"
      />
      <AccountCard
        title="Edit Account Information"
        to="/account_editor"
        description="Edit account information"
        footnote=""
        class="AccountCard"
      />
      <AccountCard
        v-if="acc_store.userid[0] == 'S'"
        title="Change Departments"
        to="/staff_edit_department"
        description="Change department"
        footnote=""
        class="AccountCard"
      />
      <AccountCard
        :image="_BASE_URL + 'icons/pen.svg'"
        title="Edit Entries"
        to="/business_editor_search"
        description="Edit database entries"
        footnote="Admin Command"
        class="AccountCard"
      />
      <AccountCard
        v-if="acc_store.userid[0] == 'S'"
        :image="_BASE_URL + 'icons/user-pen.svg'"
        title="Create an account"
        to="/create_account"
        description="Add an account"
        footnote="Moderator Command"
        class="AccountCard"
      />
      <AccountCard
        :image="_BASE_URL + 'icons/user-pen.svg'"
        title="Edit Account Permissions"
        to="/"
        description="Edit the permissions given to users of the website (not yet implemented)"
        footnote="Moderator Command"
        class="AccountCard"
      />
      <AccountCard
        title="Server Maintenance"
        to="/"
        description="View server statistics and perform basic automated tasks (not yet implemented)"
        footnote="Server Admin Command"
        class="AccountCard"
      />
      <AccountCard
        :image="_BASE_URL + 'icons/Radiation_warning_symbol.svg'"
        title="Launch the Nukes"
        to="/"
        description="Luckily Unimplemented"
        footnote="Presidential Command"
        class="AccountCard"
      />
    </div>

    <RouterLink v-else class="sign-in-reminder" to="/sign_in?redirect_after=account"
      >Please Sign In First</RouterLink
    >
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
