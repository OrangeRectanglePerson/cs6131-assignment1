<script setup lang="ts">
import '@/assets/base.css'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="about">
    <p class="michroma-regular brand" v-on:click="router.push({ name: 'home' })" type="button">
      The<br />
      Digital<br />
      Phonebook
    </p>
    <h1>About the website</h1>
    <h2>Made by Devon</h2>
    <p>
      Web design encompasses many different skills and disciplines in the production and maintenance
      of websites. The different areas of web design include web graphic design; user interface
      design (UI design); authoring, including standardised code and proprietary software; user
      experience design (UX design); and search engine optimization. Often many individuals will
      work in teams covering different aspects of the design process, although some designers will
      cover them all.[1] The term "web design" is normally used to describe the design process
      relating to the front-end (client side) design of a website including writing markup. Web
      design partially overlaps web engineering in the broader scope of web development. Web
      designers are expected to have an awareness of usability and be up to date with web
      accessibility guidelines.
    </p>
    <h2>Thanks to:</h2>
    <ul>
      <li>Vernon Adams for designing the font "Michroma"</li>
      <li>Daniel Johnson and Cyreal for designing the font "Jura"</li>
      <li>Evan You and the Core Team for developing "Vue.js"</li>
      <li>
        <a href="https://commons.wikimedia.org/wiki/User:Manjiro5">Manjiro5</a>,
        <a href="https://commons.wikimedia.org/wiki/File:Square_book_icon.svg">Square book icon</a>,
        colors by Lim Devon,
        <a href="https://creativecommons.org/licenses/by/4.0/legalcode" rel="license">CC BY 4.0</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.about {
  top: 0;
  left: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgb(var(--color-main-3));
  color: rgb(var(--color-contrast-light));
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow: auto;
  font-size: 16pt;
}

.brand {
  position: relative;
  left: 0;
  width: fit-content;
  color: goldenrod;
  opacity: 0;
  animation: brandFadeIn 1s ease-out 0s normal forwards !important;
  height: fit-content;
  font-size: 2em;
}

h1 {
  position: relative;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards;
}
h2 {
  font-size: 1.5em;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards;
}
p {
  font-size: 1em;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards;
}
ul {
  font-size: 1em;
  opacity: 0;
  animation: textFadeIn 1s ease-out 1s normal forwards;
}
a {
  color: rgb(var(--color-contrast-light));
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
</style>
