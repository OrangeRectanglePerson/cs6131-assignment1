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
      component: () => import('@/views/deprecated/SearchView.vue'),
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/views/deprecated/BusinessView.vue'),
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: () => import('@/views/forms/SignInView.vue'),
    },
    {
      path: '/create_account',
      name: 'create_account',
      component: () => import('@/views/forms/CreateAccountView.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
    },
    {
      path: '/account_details',
      name: 'account_details',
      component: () => import('@/views/details_pages/AccountDetailsView.vue'),
    },
    {
      path: '/account_editor',
      name: 'account_editor',
      component: () => import('@/views/forms/AccountEditView.vue'),
    },
    {
      path: '/edit_nok',
      name: 'edit_nok',
      component: () => import('@/views/forms/EditNextOfKinView.vue'),
    },
    {
      path: '/staff_edit_department',
      name: 'staff_edit_department',
      component: () => import('@/views/forms/StaffChangeDepartment.vue'),
    },
    {
      path: '/edit_specialisation',
      name: 'edit_specialisation',
      component: () => import('@/views/forms/EditSpecialisation.vue'),
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('@/views/deprecated/FavouritesView.vue'),
    },
    {
      path: '/business_editor_search',
      name: 'business_editor_search',
      component: () => import('@/views/deprecated/EditBusinessSearchView.vue'),
    },
    {
      path: '/business_editor',
      name: 'business_editor',
      component: () => import('@/views/deprecated/EditBusinessView.vue'),
    },
    {
      path: '/doctor_search',
      name: 'doctor_search',
      component: () => import('@/views/search_pages/DoctorSearch.vue'),
    },
    {
      path: '/medicine_search',
      name: 'medicine_search',
      component: () => import('@/views/search_pages/MedicineSearch.vue'),
    },
    {
      path: '/medicine',
      name: 'medicine',
      component: () => import('@/views/details_pages/MedicineDetailsView.vue'),
    },
    {
      path: '/edit_medicine',
      name: 'edit_medicine',
      component: () => import('@/views/forms/EditMedicineView.vue'),
    },
    {
      path: '/facility_search',
      name: 'facility_search',
      component: () => import('@/views/search_pages/FacilitySearch.vue'),
    },
    {
      path: '/facility',
      name: 'facility',
      component: () => import('@/views/details_pages/FacilityDetailsView.vue'),
    },
    {
      path: '/treatment_search',
      name: 'treatment_search',
      component: () => import('@/views/search_pages/TreatmentSearch.vue'),
    },
    {
      path: '/treatment',
      name: 'treatment',
      component: () => import('@/views/details_pages/TreatmentDetailsView.vue'),
    },
    {
      path: '/edit_treatment',
      name: 'edit_treatment',
      component: () => import('@/views/forms/EditTreatmentView.vue'),
    },
    {
      path: '/patient_search',
      name: 'patient_search',
      component: () => import('@/views/search_pages/PatientSearch.vue'),
    },
  ],
})

export default router
