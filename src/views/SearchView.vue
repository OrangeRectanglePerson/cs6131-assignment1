<script setup lang="ts">
import '@/assets/main.css'
import SearchResultBig from '@/components/SearchResultBig.vue'
import { ref } from 'vue'

const search_query = ref('')
const items = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
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
        />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
    <h4 v-if="search_query === ''" class="search-querier">Type something to search!</h4>
    <h4 v-else class="search-querier">
      Search Results for: <i>"{{ search_query }}"</i>
    </h4>

    <div class="search-results-list-container" v-if="search_query !== ''">
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
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&display=swap');

main {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding-top: 1em;
  left: 0;
  background-color: #8a3e24;
  display: flex;
  flex-direction: column;
  padding: 1em;
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
  color: white;
  font-size: 1em;
  animation: fadeIn 1s ease-out;
  height: fit-content;
}

.searchbar {
  height: 2em;
  width: auto;
  margin-top: 0.5em;
  margin-left: 2em;
  margin-right: 7em;
  grid-column: 2;
}

.search-querier {
  font-family: 'Oxanium', sans-serif;
  font-weight: 400;
  color: white;
  width: 90vw;
  margin: 0.5em auto;
  padding: 0.5em 0.5em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}

.btn {
  padding: 0 1em;
}

.search-results-list-container {
  overflow-y: scroll;
  overflow-x: hidden;
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 0;
  margin: 0 auto;
  height: inherit;
  width: 85vw;
  scrollbar-width: thin;
}

.search-results {
  color: white;
  font-family: 'Oxanium', sans-serif;
}

@keyframes fadeIn {
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
