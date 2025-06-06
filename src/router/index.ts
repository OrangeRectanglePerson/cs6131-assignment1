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
      path: '/doctor_search',
      name: 'doctor_search',
      component: () => import('@/views/search_pages/DoctorSearch.vue'),
    },
    {
      path: '/specialist_search',
      name: 'specialist_search',
      component: () => import('@/views/search_pages/SpecialistSearch.vue'),
    },
    {
      path: '/pharmacist_search',
      name: 'pharmacist_search',
      component: () => import('@/views/search_pages/PharmacistSearch.vue'),
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
    {
      path: '/edit_prescription',
      name: 'edit_prescription',
      component: () => import('@/views/forms/EditPrescriptionView.vue'),
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: () => import('@/views/details_pages/AppointmentDetailsView.vue'),
    },
    {
      path: '/edit_appointments',
      name: 'edit_appointments',
      component: () => import('@/views/forms/EditAppointmentView.vue'),
    },
  ],
})

export default router
