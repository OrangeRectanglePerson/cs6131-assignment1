<script setup lang="ts">
import '@/assets/main.css'
import SearchResultBig from '@/components/SearchResultBig.vue'
import { useAccountStore } from '@/stores/account'
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const acc_store = useAccountStore()
const router = useRouter()
const results_scroll_perc = ref(1)
const search_results_list_container = useTemplateRef('search_results_list_container')

function update_results_scroll_perc() {
  results_scroll_perc.value =
    1 -
    search_results_list_container.value!.scrollTop /
      (search_results_list_container.value!.scrollHeight -
        search_results_list_container.value!.offsetHeight)
}
</script>

<template>
  <main>
    <div class="top">
      <h1 class="michroma-regular brand" v-on:click="router.push({ name: 'home' })" type="button">
        The<br />
        Digital<br />
        Phonebook
      </h1>
    </div>

    <div class="search-querier-wrapper">
      <RouterLink
        v-if="!acc_store.signed_in"
        class="search-querier"
        to="/sign_in?redirect_after=favourites"
        >Please Sign In First</RouterLink
      >
      <p v-else-if="acc_store.favourites.length === 0" class="search-querier">
        You have not saved any businesses in your favourites list.
      </p>
      <p v-else class="search-querier">Your Saved Businesses:</p>
    </div>
    <div
      class="search-results-list-container"
      v-if="acc_store.favourites.length !== 0"
      v-on:scroll="update_results_scroll_perc"
      ref="search_results_list_container"
    >
      <li v-for="id in acc_store.favourites" :key="id">
        <SearchResultBig
          :name="id"
          :address="id + ' Placeholder ' + 'Lane'"
          :phone_number="'1800-PLACE-HOLDER'"
          :website="id.replace(' ', '') + '.example.com'"
          class="search-results"
        />
      </li>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@300..700&display=swap');

.v-enter-active {
  transition: opacity 0.3s ease;
}

.v-enter-from {
  opacity: 0;
}

main {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 1em;
  left: 0;
  background-color: rgb(var(--color-contrast-dark));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top {
  display: grid;
  width: 100%;
  grid-template-columns: min-content;
  height: fit-content;
  grid-row-gap: 1em;

  animation: contentFadeIn 1s ease-out 0s normal forwards;
}

.brand {
  position: relative;
  padding-left: 1em;
  left: 0;
  width: fit-content;
  color: goldenrod;
  font-size: 1.5em;
  height: fit-content;
  animation: brandFadeIn 1s ease-out 0s normal forwards;
}

.searchbar {
  height: 2em;
  margin: 1em auto;
  font-weight: 400;
  width: 50em;
  max-width: 90vw;
}

.btn {
  transition: 0.3s;
  padding: 0 1em;
  color: black !important;
  background-color: rgb(var(--color-contrast-light)) !important;
}
.btn:hover {
  filter: brightness(85%);
  transition: 0.3s;
}

.search-querier-wrapper {
  animation: contentFadeIn 1s ease-out 0s normal forwards;
}
.search-querier {
  font-weight: 400;
  font-size: 1.5em;
  color: white;
  max-width: 90vw;
  margin: 0.1em auto 1em auto;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.search-results-list-container {
  overflow-y: auto;
  overflow-x: hidden;
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 0;
  margin: 0 auto;
  width: 85vw;
  scrollbar-width: thin;
  font-size: 1.1em;
  padding: 0.5em 0;
  border-top: 0.1em solid white;
  border-bottom: 0.1em solid white;
}

.search-results {
  color: white;
  grid-row-gap: 1.2em;
  padding: 1.2em 0;
}

@keyframes brandFadeIn {
  0% {
    top: 0.5em;
  }
  100% {
    top: 0em;
  }
}

@keyframes contentFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 100vh) {
  .top {
    grid-template-columns: auto;
  }

  .search-querier {
    font-size: larger;
    text-align: center;
  }
}
</style>
