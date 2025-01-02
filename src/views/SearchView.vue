<script setup lang="ts">
import '@/assets/main.css'
import { ref } from 'vue'

const search_query = ref('')
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
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 1em;
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
  margin-top: 0;
  margin-left: 2em;
  margin-right: 7em;
  grid-column: 2;
}

.search-querier {
  font-family: 'Oxanium', sans-serif;
  font-weight: 400;
  justify-self: center;
  color: white;
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
  .searchbar {
    margin: 0 5vw;
    width: 90vw;
    grid-column: 1;
  }
}
</style>
