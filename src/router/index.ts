import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/welcome/:force_name',
      name: 'welcome',
      component: HomeView,
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/views/BusinessView.vue'),
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: () => import('@/views/SignInView.vue'),
    },
    {
      path: '/create_account',
      name: 'create_account',
      component: () => import('@/views/CreateAccountView.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
    },
    {
      path: '/account_editor',
      name: 'account_editor',
      component: () => import('@/views/AccountEditView.vue'),
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('@/views/FavouritesView.vue'),
    },
    {
      path: '/business_editor_search',
      name: 'business_editor_search',
      component: () => import('@/views/EditBusinessSearchView.vue'),
    },
    {
      path: '/business_editor',
      name: 'business_editor',
      component: () => import('@/views/EditBusinessView.vue'),
    },

    {
      path: '/doctor_search',
      name: 'doctor_search',
      component: () => import('@/views/DoctorSearch.vue'),
    },
  ],
})

export default router
