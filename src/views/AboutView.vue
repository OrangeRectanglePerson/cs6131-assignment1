<script setup lang="ts">
import '@/assets/base.css'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="about">
    <p class="michroma-regular brand" v-on:click="router.push({ name: 'home' })" type="button">
      Patient Data<br />
      Management<br />
      System
    </p>
    <h1>About the website</h1>
    <h2>Made by Lim Devon & Cheng Jia Jie Kieran</h2>
    <p>
      An electronic health record (EHR) is the systematized collection of electronically stored patient and population health information in a digital format.[1] These records can be shared across different health care settings. Records are shared through network-connected, enterprise-wide information systems or other information networks and exchanges. EHRs may include a range of data, including demographics, medical history, medication and allergies, immunization status, laboratory test results, radiology images, vital signs, personal statistics like age and weight, and billing information.[2]
    </p>
    <h2>Thanks to:</h2>
    <ul>
      <li>
        The many dedicated contributors to Vite, Vue, Pinia, Prettier, ESLint, Node.JS, Bootstrap,
        TypeScript, and the innumerable other dependancies this project could not have been made
        possible without.
      </li>
      <li>
        <a href="https://github.com/googlefonts/Michroma-font"> The Michroma Project Authors </a>
        for designing the font "Michroma" (under the
        <a href="https://openfontlicense.org/open-font-license-official-text/">
          SIL Open Font License, Version 1.1 </a
        >)
      </li>
      <li>
        <a href="https://github.com/Omnibus-Type/Saira"> The Saira Project Authors </a> for
        designing the font "Saira" (under the
        <a href="https://openfontlicense.org/open-font-license-official-text/">
          SIL Open Font License, Version 1.1 </a
        >)
      </li>
      <li>
        <a href="https://commons.wikimedia.org/wiki/User:Manjiro5">Manjiro5</a>,
        <a href="https://commons.wikimedia.org/wiki/File:Square_book_icon.svg">Square book icon</a>,
        <a href="https://creativecommons.org/licenses/by/4.0/legalcode" rel="license">CC BY 4.0</a>
      </li>
      <li>
        <a href="https://commons.wikimedia.org/wiki/User:Lydia_Jane_Lewington"
          >Lydia Jane Lewington</a
        >,
        <a
          href="https://commons.wikimedia.org/wiki/File:Office_space_oxford_street_fitzrovia_office_space_for_hire_20_desk_office.jpg"
          >Office space oxford street fitzrovia office space for hire 20 desk office</a
        >,
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" rel="license"
          >CC BY-SA 4.0</a
        >
      </li>
      <li>
        <a href="https://thenounproject.com/adnen.kadri/">Adnen Kadri</a>,
        <a href="https://commons.wikimedia.org/wiki/File:Noun_project_Globe_icon_1109009.svg"
          >Noun project Globe icon 1109009</a
        >,
        <a href="https://creativecommons.org/licenses/by/3.0/deed.en" rel="license">CC BY 3.0</a>
      </li>
      <li>
        <a href="https://coreui.io/">CoreUI</a>,
        <a
          href="https://commons.wikimedia.org/wiki/File:Office_space_oxford_street_fitzrovia_office_space_for_hire_20_desk_office.jpg"
          >Cib-nextdoor (CoreUI Icons v1.0.0)</a
        >,
        <a href="https://github.com/coreui/coreui-icons/blob/v2/LICENSE" rel="license"
          >CoreUI Icons Free License</a
        >
      </li>
      <li>
        <a href="https://fontawesome.com">Font Awesome</a>,
        <a href="https://commons.wikimedia.org/wiki/File:User-pen-solid.svg">User-pen-solid</a>,
        <a href="https://creativecommons.org/licenses/by/4.0/deed.en" rel="license">CC BY 4.0</a>
      </li>
      <li>
        <a href="https://fontawesome.com">Font Awesome</a>,
        <a href="https://commons.wikimedia.org/wiki/File:Pen-solid.svg">Pen-solid</a>,
        <a href="https://creativecommons.org/licenses/by/4.0/deed.en" rel="license">CC BY 4.0</a>
      </li>
      <li>Wikipedia for the paragraphs used as placeholder text</li>
      <li>House, M.D. for the placeholder images</li>
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
  font-size: 0.9em;
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
