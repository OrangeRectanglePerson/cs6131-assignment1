<script setup lang="ts">
import '@/assets/main.css'
import { useAccountStore } from '@/stores/account'
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const acc_store = useAccountStore()
const router = useRouter()
const route = useRoute()
const business_id = typeof route.query.id === 'undefined' ? '' : (route.query.id as string)

const address = ref(''),
  phone_number = ref(''),
  website = ref('')

onBeforeMount(() => {
  if (business_id !== '') {
    address.value = business_id + ' Placeholder Lane'
    phone_number.value = '1800-PLACE-HOLDER'
    website.value = business_id.replace(' ', '') + '.example.com'
  }
})
</script>

<template>
  <main class="business-screen">
    <h1 class="michroma-regular big-brand" v-on:click="router.push({ name: 'home' })" type="button">
      The<br />
      Digital<br />
      Phonebook
    </h1>
    <p v-if="business_id === ''" class="business-title">
      This Business Does Not Exist! Please return to the <RouterLink to="/">Home Page</RouterLink>
    </p>
    <div v-else style="display: contents" class="everything-container">
      <p class="business-title">{{ business_id }}</p>

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Office_space_oxford_street_fitzrovia_office_space_for_hire_20_desk_office.jpg/800px-Office_space_oxford_street_fitzrovia_office_space_for_hire_20_desk_office.jpg"
        class="business-image"
      />

      <div class="details">
        <p class="address">
          <img
            src="@/components/icons/nextdoor.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ address }}
        </p>
        <p class="website">
          <img
            src="@/components/icons/globe.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ website }}
        </p>
        <p class="phone_number">
          <img
            src="@/components/icons/telephone_icon.svg"
            style="height: 1em; width: 1em; margin: 0 0.5em"
          />
          {{ phone_number }}
        </p>
      </div>

      <div class="favourite-button-container">
        <p
          v-if="!acc_store.signed_in"
          class="favourite-button"
          name="favourite-button"
          v-on:click="
            router.push({
              name: 'sign_in',
              query: { redirect_after: 'business', business_id: business_id },
            })
          "
        >
          Sign in to Save as favourite
        </p>
        <p
          v-else-if="acc_store.favourites.includes(business_id)"
          class="favourite-button"
          name="favourite-button"
          v-on:click="acc_store.remove_favourite(business_id)"
        >
          Remove from favourites
        </p>
        <p
          v-else
          class="favourite-button"
          name="favourite-button"
          v-on:click="acc_store.add_favourite(business_id)"
        >
          Save as a favourite
        </p>
      </div>

      <h4>Description:</h4>
      <p class="business-description">
        This is a Placeholder Description. Upholstery comes from the Middle English word upholder,
        which referred to an artisan who makes fabric furnishings. The term is equally applicable to
        domestic, automobile, airplane and boat furniture, and can be applied to mattresses,
        particularly the upper layers, though these often differ significantly in design. A person
        who works with upholstery is called an upholsterer. An apprentice upholsterer is sometimes
        called an outsider or trimmer. Traditional upholstery uses materials like coil springs
        (post-1850), animal hair (horse, hog and cow), coir, straw and hay, hessians, linen scrims,
        wadding, etc., and is done by hand, building each layer up. In contrast, today's
        upholsterers employ synthetic materials like dacron and vinyl, serpentine springs, and so
        on.
      </p>

      <h4>Reviews:</h4>
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

.business-title {
  font-size: 3em;
  margin: 0 auto;
}

.business-image {
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

.business-title,
.business-image,
.details,
.favourite-button-container,
.business-description {
  opacity: 0;
  animation: textFadeIn 0.5s ease-out 0.5s normal forwards !important;
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
