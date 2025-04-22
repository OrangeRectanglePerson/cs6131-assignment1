<script setup lang="ts">
import '@/assets/main.css'
import SearchResultBig from '@/components/SearchResultBig.vue'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const search_query = ref(
  typeof route.query.search_query === 'undefined' ? '' : (route.query.search_query as string),
)
const items = ref([1, 2, 3, 4, 5])
const results_scroll_perc = ref(1)
const search_results_list_container = useTemplateRef('search_results_list_container')

onMounted(() => {
  new_search()
})

function update_results_scroll_perc() {
  results_scroll_perc.value =
    1 -
    search_results_list_container.value!.scrollTop /
      (search_results_list_container.value!.scrollHeight -
        search_results_list_container.value!.offsetHeight)
}

function search_btn(event: { preventDefault: () => void }) {
  event.preventDefault()
  router.push({ name: 'search', query: { search_query: search_query.value } })
  new_search()
}

function new_search() {
  if (search_query.value === '') return

  //placeholder search for now
  items.value = []
  for (let i = 0; i < 3 + Math.floor(Math.random() * 18); i++) {
    items.value = items.value.concat([i])
  }
  //end placeholder

  search_results_list_container.value!.scrollTop = 0
  results_scroll_perc.value = 1
}
</script>

<template>
  <main>
    <div class="top">
      <h1 class="michroma-regular brand" v-on:click="router.push({ name: 'home' })" type="button">
        Patient Data<br />
      Management<br />
      System
      </h1>
    </div>

    <form class="d-flex searchbar" role="search" v-on:submit="search_btn">
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

    <div class="search-querier-wrapper">
      <Transition>
        <p v-if="search_query === ''" class="search-querier">Type something to search!</p>
        <p v-else class="search-querier">
          Search Results for: <i>"{{ search_query }}"</i>
        </p>
      </Transition>
    </div>
    <Transition>
      <div
        class="search-results-list-container"
        v-if="search_query !== ''"
        v-on:scroll="update_results_scroll_perc"
        ref="search_results_list_container"
      >
        <li v-for="item in items" :key="item">
          <SearchResultBig
            :name="search_query + ' ' + item"
            :address="search_query + ' ' + item + ' Placeholder Lane'"
            :phone_number="'1800-PLACE-HOLDER'"
            :website="search_query + item + '.example.com'"
            class="search-results"
          />
        </li>
      </div>
    </Transition>
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
  background-color: rgb(var(--color-main-3));
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
  filter: brightness(125%);
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
