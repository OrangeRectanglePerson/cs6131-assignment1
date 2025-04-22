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
      path: '/account_details',
      name: 'account_details',
      component: () => import('@/views/AccountDetailsView.vue'),
    },
    {
      path: '/account_editor',
      name: 'account_editor',
      component: () => import('@/views/AccountEditView.vue'),
    },
    {
      path: '/edit_nok',
      name: 'edit_nok',
      component: () => import('@/views/CreateNextOfKinView.vue'),
    },
    {
      path: '/staff_edit_department',
      name: 'staff_edit_department',
      component: () => import('@/views/StaffChangeDepartment.vue'),
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
    {
      path: '/medicine_search',
      name: 'medicine_search',
      component: () => import('@/views/MedicineSearch.vue'),
    },
    {
      path: '/medicine',
      name: 'medicine',
      component: () => import('@/views/MedicineDetailsView.vue'),
    },
    {
      path: '/facility_search',
      name: 'facility_search',
      component: () => import('@/views/FacilitySearch.vue'),
    },
    {
      path: '/facility',
      name: 'facility',
      component: () => import('@/views/FacilityDetailsView.vue'),
    },
    {
      path: '/treatment_search',
      name: 'treatment_search',
      component: () => import('@/views/TreatmentSearch.vue'),
    },
    {
      path: '/treatment',
      name: 'treatment',
      component: () => import('@/views/TreatmentDetailsView.vue'),
    },
  ],
})

export default router
