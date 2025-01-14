<script setup lang="ts">
import '@/assets/main.css'

defineProps({
  title: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  description: String,
  footnote: String,
  image: {
    type: String,
    default: '/square_book_icon.svg',
  },
})
</script>

<template>
  <div class="account-card">
    <img :src="image" />
    <RouterLink :to="to" class="title">{{ title }}</RouterLink>
    <p>{{ description }}</p>
    <p class="footnote">{{ footnote }}</p>
  </div>
</template>

<style scoped>
.account-card {
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--color-main-2));
  width: fit-content;
  padding: 1em;
  border: 2px solid goldenrod;
  border-radius: 1em;
}

img {
  max-width: 10em;
  max-height: 10em;
  object-fit: contain;
  object-position: left;
  margin-bottom: 1em;
  border: 2px solid black;
  border-radius: 1em;
}

.title {
  font-size: 1.6em;
  color: white;
  margin-bottom: 1rem;
  border-radius: 0.2em;
  text-underline-offset: 0.1em;
  transition: all 0.3s;
}
.title:hover {
  background-color: rgba(var(--color-contrast-light), 0.15);
  text-underline-offset: 0.25em;
}

.footnote {
  font-size: 0.9em;
  margin: 0;
  font-weight: 300;
  bottom: 0;
  margin-top: auto;
}
</style>
