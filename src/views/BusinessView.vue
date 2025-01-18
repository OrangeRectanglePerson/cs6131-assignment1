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
    address.value = business_id + ' Road'
    phone_number.value = '987654321'
    website.value = business_id.replace(' ', '') + '.com'
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
    <p v-else class="business-title">{{ business_id }}</p>

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
        <img src="@/components/icons/globe.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
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

    <p class="business-description">
      [32] Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque
      laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto
      beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur
      aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi
      nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur
      adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et
      dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d]
      exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
      [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil
      molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur? [33] At
      vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum
      deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate
      non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et
      dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero
      tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime
      placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus
      autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et
      voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
      sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
      doloribus asperiores repellat.
    </p>
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
  opacity: 0;
  animation: textFadeIn 0.5s ease-out 1s normal forwards !important;
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

.business-description {
  font-size: 1.2em;
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
