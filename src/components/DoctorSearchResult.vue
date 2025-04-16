<script setup lang="ts">
defineProps({
  name: String,
  department: String,
  phone_number: String,
  staff_id: String,
})
</script>

<template>
  <div class="search-result-container">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Office_space_oxford_street_fitzrovia_office_space_for_hire_20_desk_office.jpg/800px-Office_space_oxford_street_fitzrovia_office_space_for_hire_20_desk_office.jpg"
      class="search_result_image"
    />
    <div style="display: grid; width: 100%">
      <RouterLink class="name" :to="'/doctor?id=' + name">{{
        name
      }}</RouterLink>
      <div class="details">
        <p class="address">
          <img src="./icons/nextdoor.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Dept: {{ department }}
        </p>
        <p class="website">
          <img src="./icons/globe.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          Staff ID: S{{ staff_id }}
        </p>
        <p class="phone_number">
          <img src="./icons/telephone_icon.svg" style="height: 1em; width: 1em; margin: 0 0.5em" />
          {{ phone_number }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-result-container {
  display: flex;
  flex-direction: row;
  border: solid;
  border-width: 1px 0;
  border-image: linear-gradient(to right, transparent 0%, white 10% 90%, transparent 100%) 1;
  grid-row-gap: 1em;
  padding: 1em 0;
}

.name {
  padding: 0 1em;
  margin: 0;
  font-weight: 400;
  font-size: 1.25em;
  line-height: 1;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 0.2em;
  color: white;
  align-content: center;
  transition: all 0.3s;
  text-underline-offset: 0.1em;
}
.name:hover {
  background-color: rgb(var(--color-main-2));
  text-underline-offset: 0.25em;
}
.details {
  display: flex;
  padding: 0 1em 0 2em;
  flex-direction: column;
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

.search_result_image {
  max-height: 10em;
  max-width: 15em;
  left: 0;
  margin: 0 2em 0 2em;
  grid-column: 2;
  grid-row: 1;
}

@media (max-width: 100vh) {
  .search-result-container {
    flex-direction: column;
  }
  .name {
    text-align: center;
  }
  .details {
    grid-auto-flow: row;
  }
  .search_result_image {
    max-width: 80vw;
  }
}
</style>
