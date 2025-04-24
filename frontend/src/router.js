import { createRouter, createWebHistory } from 'vue-router';

// Importar los componentes que vas a mostrar en las rutas
import HomePage from '../src/views/HomeView.vue';
import AboutPage from '../src/views/AboutView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
