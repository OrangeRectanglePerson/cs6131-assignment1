<script setup lang="ts">
defineProps({
  name: String,
  address: String,
  phone_number: String,
  website: String,
})
</script>

<template>
  <div class="search-result-container">
    <p class="name">{{ name }}</p>
    <div class="details">
      <p class="address">{{ address }}</p>
      <p class="website">{{ website }}</p>
      <p class="phone_number">{{ phone_number }}</p>
    </div>
  </div>
</template>

<style scoped>
.search-result-container {
  display: grid;
  border: solid;
  border-width: 1px 0;
  border-image: linear-gradient(to right, transparent 0%, white 10% 90%, transparent 100%) 1;
  grid-row-gap: 1em;
  padding: 1em 0;
}

.name {
  padding: 0 5%;
  margin: 0;
  font-weight: 300;
  font-size: 1.25em;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.details {
  display: grid;
  grid-auto-flow: column;
  padding: 0 5%;
  grid-template-columns: 1fr 1fr 1fr;
}
.details > p {
  margin: 0;
  font-weight: 300;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address {
  text-align: center;
}
.website {
  text-align: center;
}
.phone_number {
  text-align: center;
}

@media (max-width: 100vh) {
  .name {
    text-align: center;
  }
  .details {
    grid-auto-flow: row;
  }
}
</style>
