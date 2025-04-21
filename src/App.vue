<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { computed, onBeforeMount } from 'vue'
import { useAccountStore } from '@/stores/account'

const route = useRoute()
const acc_store = useAccountStore()

const hideNavBar = computed(() => {
  const noShowRoutes: string[] = []
  for (const r of noShowRoutes) {
    if (r === route.name) {
      return true
    }
  }
  return false
})

onBeforeMount(() => {
  acc_store.restore_session();
}
)
</script>

<template>
  <NavBar v-if="!hideNavBar" />

  <RouterView />
</template>

<style scoped>
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
