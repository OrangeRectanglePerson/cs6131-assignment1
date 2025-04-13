<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <h1 v-on:click="router.push({ name: 'home' })" type="button">
      Patient Data<br />
      Management<br />
      System
  </h1>
</template>

<style scoped>
  h1 {
    position: relative;
    padding-left: 1em;
    left: 0;
    width: fit-content;
    color: goldenrod;
    font-size: 1em;
    opacity: 0;
    animation: brandFadeIn 1s ease-out 0s normal forwards !important;
    height: fit-content;
    font-family: 'Michroma', 'Jura', sans-serif;
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

</style>
