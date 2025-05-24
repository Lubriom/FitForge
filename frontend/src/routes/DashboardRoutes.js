export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/MainView.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  },
  {
    path: "/dashboard/profile",
    name: "DashboardProfile",
    component: () => import("@/views/dashboard/ProfileView.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  },
  {
    path: "/dashboard/profile/:id",
    name: "DashboardSeeProfile",
    component: () => import("@/views/dashboard/SeeProfileView.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  },
  {
    path: "/dashboard/stats/",
    name: "DashboardStats",
    component: () => import("@/views/dashboard/SeeProfileView.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  },
  {
    path: "/dashboard/settings",
    name: "DashboardSettings",
    component: () => import("@/views/dashboard/SettingsView.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  },
  {
    path: "/dashboard/admin",
    name: "DashboardAdmin",
    component: () => import("@/views/dashboard/AdminView.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  },
  {
    path: "/dashboard/admin/edit/:id",
    name: "DashboardAdminEdit",
    component: () => import("@/views/dashboard/EditProfile.vue"),
    meta: { layout: "dashboard", requiresAuth: true }
  }
];
