import { createRouter, createWebHistory } from 'vue-router';

// Importar los componentes que vas a mostrar en las rutas
import HomeView from '../src/views/HomeView.vue';
import AboutView from '../src/views/AboutView.vue';
import EditView from '../src/views/EditView.vue';
import LoginView from './views/auth/LoginView.vue';
import RegisterView from './views/auth/RegisterView.vue';
import StartView from './views/StartView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: EditView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/start',
    name: 'Start',
    component: StartView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
