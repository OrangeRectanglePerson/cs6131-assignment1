<script setup lang="ts">
import '@/assets/main.css'
import SearchResultBig from '@/components/SearchResultBig.vue'
import { ref, useTemplateRef } from 'vue'

const search_query = ref('')
const items = ref([1, 2, 3, 4, 5])
const results_scroll_perc = ref(1)
const search_results_list_container = useTemplateRef('search_results_list_container')

function update_results_scroll_perc() {
  results_scroll_perc.value =
    1 -
    search_results_list_container.value!.scrollTop /
      (search_results_list_container.value!.scrollHeight -
        search_results_list_container.value!.offsetHeight)
}

function new_search() {
  DEMO_PURPOSES()

  search_results_list_container.value!.scrollTop = 0
  results_scroll_perc.value = 1
}

function DEMO_PURPOSES() {
  items.value = []
  for (let i = 0; i < 3 + Math.floor(Math.random() * 18); i++) {
    items.value = items.value.concat([i])
  }
}
</script>

<template>
  <main>
    <div class="top">
      <h1 class="michroma-regular brand">
        The<br />
        Digital<br />
        Phonebook
      </h1>

      <form class="d-flex searchbar" role="search">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          v-model="search_query"
          v-on:input="new_search"
        />
        <button class="btn" type="submit">Search</button>
      </form>
    </div>
    <p v-if="search_query === ''" class="search-querier">Type something to search!</p>
    <p v-else class="search-querier">
      Search Results for: <i>"{{ search_query }}"</i>
    </p>

    <div
      class="search-results-list-container"
      v-if="search_query !== ''"
      v-on:scroll="update_results_scroll_perc"
      ref="search_results_list_container"
    >
      <li v-for="item in items" :key="item">
        <SearchResultBig
          :name="search_query + ' ' + item"
          :address="item + ' ' + search_query + ' ' + 'lane'"
          :phone_number="'9876543' + item"
          :website="search_query + item + '.com'"
          class="search-results"
        />
      </li>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@300..700&display=swap');

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

.top {
  display: grid;
  width: 100%;
  grid-template-columns: min-content;
  height: fit-content;
  grid-row-gap: 1em;
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
}

.searchbar {
  height: 2em;
  width: auto;
  margin-top: 0.5em;
  margin-left: 2em;
  margin-right: 7em;
  grid-column: 2;
  font-weight: 400;
}

.btn {
  transition: 0.3s;
  padding: 0 1em;
  color: black !important;
  background-color: var(--color-contrast-light) !important;
}
.btn:hover {
  filter: brightness(85%);
  transition: 0.3s;
}

.search-querier {
  font-family: 'Jura', sans-serif;
  font-weight: 300;
  font-size: 1.5em;
  color: white;
  max-width: 90vw;
  margin: 1em auto;
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
  font-family: 'Jura', sans-serif;
  font-weight: 300;
  color: white;
  grid-row-gap: 1.2em;
  padding: 1.2em 0;
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
