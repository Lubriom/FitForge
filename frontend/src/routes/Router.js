import { createRouter, createWebHistory } from "vue-router";
import { isTokenValid } from '@/utils/Auth.js';

// Importar los componentes que vas a mostrar en las rutas
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import EditView from "@/views/EditView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import StartView from "@/views/StartView.vue";
import DashboardRoutes from "./DashboardRoutes.js";
import ExercisesRoutes from "./ExercisesRoutes.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView
  },
  {
    path: "/about",
    name: "About",
    component: AboutView
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: EditView,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { layout: "auth" }
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: { layout: "auth"}
  },
  ...DashboardRoutes,
  ...ExercisesRoutes
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isTokenValid()) {
    next('/login'); 
  } else {
    next(); 
  }
});

export default router;
