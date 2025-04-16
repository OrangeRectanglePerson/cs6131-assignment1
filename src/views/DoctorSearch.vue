<script setup lang="ts">
import '@/assets/main.css'
import DoctorSearchResult from '@/components/DoctorSearchResult.vue'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const router = useRouter()
const route = useRoute()
const search_query = ref(
  typeof route.query.search_query === 'undefined' ? '' : (route.query.search_query as string),
)
const items = ref([])
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
  router.push({ name: 'doctor_search', query: { search_query: search_query.value } })
  new_search()
}

function new_search() {
  if (search_query.value === '') return

  //all your search needs are here
  fetch(`${BACKEND_URL}/get_doctors`, {
    method: "POST",
    body: JSON.stringify({
      start_from : 0,
      num_entries: !Number.isNaN(search_query.value) ? parseInt(search_query.value) : 50 // PLACEHOLDER VALUE
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  })
      // this results in a response promise that promises some sort of response
      // will be received from where the post was sent to
      .then((response) => {
          if(!response.ok) return Promise.reject(response)
          else return response.text()
      })
      .then((json_text : string) => {
        const json_response = JSON.parse(json_text)
        console.log(json_response)
        if(json_response["request_success"]) {
          items.value = json_response["list"]
          return "success"
        }
        return json_response["text"]
      })

      .catch(error => {
          console.log(error)
          return error
      })
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
        <p v-if="search_query === ''" class="search-querier">Type something to search! (For now, it just dictates number of entries)</p>
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
          <DoctorSearchResult
            :name="item[1]"
            :department="item[7]"
            :staff_id="item[0]"
            :phone_number="item[4]"
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
