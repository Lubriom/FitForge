<template>
    <component :is="layoutComponent">
      <router-view />
    </component>
</template>

<script setup>
import DefaultLayout from "../src/components/layouts/mainLayout.vue";
import DashboardLayout from '../src/components/layouts/dashboardLayout.vue'
import AuthLayout from "../src/components/layouts/authLayout.vue";
import CleanLayout from "../src/components/layouts/cleanLayout.vue";

import { computed } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()

const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case 'dashboard':
      return DashboardLayout
    case 'auth':
      return AuthLayout
    case 'clean':
      return CleanLayout
    default:
      return DefaultLayout
  }
})
</script>