import { createRouter, createWebHistory } from "vue-router";
import { isTokenValid } from "@/utils/Auth.js";

// Importar los componentes que vas a mostrar en las rutas
import FaqView from "@/views/FaqView.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import PrivacityView from "@/views/PrivacityView.vue";
import ConditionsView from "@/views/ConditionsView.vue";
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
    path: "/faq",
    name: "Faq",
    component: FaqView
  },
  {
    path: "/conditions",
    name: "Conditions",
    component: ConditionsView
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: PrivacityView
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
    meta: { layout: "auth" }
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
    next("/login");
  } else {
    next();
  }
});

export default router;
