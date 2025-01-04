<script setup lang="ts">
import { RouterLink , useRoute } from 'vue-router'
import '@/assets/base.css'
import { useAccountStore } from '@/stores/account'

const acc_store = useAccountStore()
const route = useRoute()

function sign_out() {
  acc_store.sign_out()
}
</script>

<template>
  <nav class="navbar fixed-top bg-transparent">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <div class="firstline">
            <Transition name="firstline" mode="out-in">
              <RouterLink
                v-if="acc_store.signed_in"
                to="/account"
                class="account-name"
                id="offcanvasNavbarLabel"
                >{{ acc_store.username }}</RouterLink
              >
              <RouterLink v-else to="/sign_in" class="account-name" id="offcanvasNavbarLabel"
                >Sign In</RouterLink
              >
            </Transition>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <p
          type="button"
          v-show="acc_store.signed_in"
          class="sign-out"
          v-on:click="sign_out"
          >Sign Out</p>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <RouterLink to="/">Home</RouterLink>
              <p v-show="route.name==='home'">you are here</p>
            </li>
            <li class="nav-item">
              <RouterLink to="/search">Search</RouterLink>
              <p v-show="route.name==='search'">you are here</p>
            </li>
            <li class="nav-item">
              <RouterLink to="/about">About</RouterLink>
              <p v-show="route.name==='about'">you are here</p>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
          <form class="d-flex mt-3" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.firstline-enter-active,
.firstline-leave-active {
  transition: opacity .3s ease;
}
.firstline-enter-from,
.firstline-leave-to {
  opacity: 0;
}

nav {
  position: fixed;
  font-size: 1rem;
  max-height: 4em;
  color: white;
  right: 0;
  left: auto;
  padding-right: 1em;
  padding-top: 1em;
}

.offcanvas-header{
  flex-direction: column;
  align-items: baseline;
  padding: 1em;
}

.firstline{
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.btn-close {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
}

.navbar-toggler {
  background-color: white;
}

.account-name {
  margin-bottom: 0;
  color: white !important;
  font-size: 2em;
  line-height: 1.2;
}
.sign-out{
  font-size: 1em;
  padding: 0 .25em;
  line-height: 1,5;
  margin: 0;
}
.sign-out:hover{
  background-color: var(--color-main-2);
  transition: background-color 200ms;
}

.offcanvas {
  background-color: var(--color-contrast-dark);
  color: white;
}

.nav-item{
  display: flex;
  align-items: center;
  gap: .5em;
}
.nav-item > a {
  color: white !important;
  font-size: 1.2em;
}
.nav-item > p{
  font-size: .8em;
  margin: 0;
}
</style>
