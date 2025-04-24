<script setup lang="ts">
import '@/assets/main.css'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopRightLogo from '@/components/TopRightLogo.vue'
import SpecialistSearchResult from '@/components/SpecialistSearchResult.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const route = useRoute()
const query_id = typeof route.query.id === 'undefined' ? '' : (route.query.id as string)

const name = ref(''),
description = ref(''),
specialists_list = ref([])

onBeforeMount(() => {
  fetch(`${BACKEND_URL}/get_treatments`, {
    method: "POST",
    headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    body: JSON.stringify({
      "start_from" : 0,
      "num_results" : 999,
      "search_text" : query_id,
      "exact_match" : true
    })
  })
  .then((response) => {
    if(!response.ok) return Promise.reject(response)
    else return response.text()
  })
  .then((json_text : string) => {
    const json_response = JSON.parse(json_text)
    console.log(json_response)
    if(json_response["request_success"]) {
      if(json_response["list"].length > 0){
        const data = json_response["list"][0]
        name.value = data[0]
        description.value = data[1]
        // get treatments provided
        fetch(`${BACKEND_URL}/get_specialists`, {
          method: "POST",
          headers: {
                  "Content-type": "application/json; charset=UTF-8"
              },
          body: JSON.stringify({
            "start_from" : 0,
            "num_results" : 999,
            "search_text" : "%",
            "filter_by_specialty" : query_id
          })
        })
        .then((response) => {
          if(!response.ok) return Promise.reject(response)
          else return response.text()
        })
        .then((json_text : string) => {
          const json_response = JSON.parse(json_text)
          console.log(json_response)
          if(json_response["request_success"]) {
            specialists_list.value = json_response['list']
          }
        })
        .catch(error => {
            console.log(error)
        })
      }
    }
  })
  .catch(error => {
      console.log(error)
  })
})

</script>

<template>
  <main class="business-screen">
    <TopRightLogo/>
    <p v-if="query_id === ''" class="name-field">
      No treatment in URL query! Please select a treatment from <RouterLink to="/treatment_search">Treatment Search Page</RouterLink>
    </p>
    <div v-else style="display: contents" class="everything-container">
      <p class="name-field">{{ name }}</p>

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/55/Hieronymus_Bosch_053_detail.jpg"
        class="user-image"
      />

      <div class="details">
        <p class="medicine-id">
          <img
            src="@/components/icons/square_book_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          Description:<br>
          {{ description }}
        </p>
      </div>

      <h4 v-if="specialists_list.length > 0">Specialists:</h4>
      <div
        class="treatments-list-container"
        v-if="specialists_list.length > 0"
        ref="treatments_list_container"
      >
        <li v-for="item in specialists_list" :key="item">
          <SpecialistSearchResult
            :name="item[1]"
            :department="item[7]"
            :staff_id="item[0]"
            :phone_number="item[4]"
            :specialisation="item[8]"
            class="treatments-results"
          />
        </li>
      </div>
      <h5 v-else>Sorry, there are no specialists offering this treatment.</h5>

    </div>
  </main>
</template>

<style scoped>
.business-screen {
  top: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  padding: 2em 5vw;
  left: 0;
  background-color: rgb(var(--color-main-3));
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  overflow: auto;
}

.big-brand {
  position: relative;
  left: 0;
  color: goldenrod;
  font-size: 1.5em;
  margin: 0;
  opacity: 0;
  animation: brandFadeIn 0.5s ease-out 0s normal forwards !important;
}

.name-field {
  font-size: 3em;
  margin: 0 auto;
}

.user-image {
  max-width: 80vw;
  max-height: 30em;
  margin: 0 auto;
  object-fit: contain;
}

.details {
  display: flex;
  padding: 0.5em 2em;
  flex-direction: column;
  background: rgb(var(--color-main-2));
  border-radius: 0.5em;
  font-size: 1.3em;
  gap: 0.5em;
}
.details > p {
  margin: 0;
  font-weight: 400;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
  margin-top: auto;
  margin-bottom: auto;
}

.favourite-button {
  display: flex;
  padding: 0.5em 2em;
  flex-direction: column;
  background: rgb(var(--color-contrast-dark));
  border-radius: 0.5em;
  font-size: 1.1em;
  text-decoration: underline;
  width: fit-content;
  transition: all 0.3s;
  text-underline-offset: 0.1em;
}
.favourite-button:hover {
  filter: brightness(120%);
  text-underline-offset: 0.25em;
}

.business-description {
  font-size: 1.2em;
}

.name-field,
.user-image,
.details,
.favourite-button-container,
.business-description {
  opacity: 0;
  animation: textFadeIn 0.5s ease-out 0.5s normal forwards !important;
}

.treatments-list-container {
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
  list-style-type: none;
}
.treatments-results {
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
