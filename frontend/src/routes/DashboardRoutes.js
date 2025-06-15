export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/MainView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
  },
  {
    path: "/start",
    name: "Start",
    component: () => import("@/views/StartView.vue"),
    meta: { layout: "clean", requiresAuth: true, requiresRole: "all" }
  },
  {
    path: "/dashboard/profile",
    name: "DashboardProfile",
    component: () => import("@/views/dashboard/ProfileView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
  },
  {
    path: "/dashboard/profile/:id",
    name: "DashboardSeeProfile",
    component: () => import("@/views/dashboard/admin/SeeProfileView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "both" }
  },
  {
    path: "/dashboard/stats/",
    name: "DashboardStats",
    component: () => import("@/views/dashboard/StatsView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
  },
  {
    path: "/dashboard/settings",
    name: "DashboardSettings",
    component: () => import("@/views/dashboard/SettingsView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
  },
  {
    path: "/dashboard/admin",
    name: "DashboardAdmin",
    component: () => import("@/views/dashboard/admin/AdminView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "both" }
  },
  {
    path: "/dashboard/admin/edit/:id",
    name: "DashboardAdminEdit",
    component: () => import("@/views/dashboard/admin/EditProfile.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "admin" }
  },
  {
    path: "/dashboard/reg/stats",
    name: "DashboardRegStats",
    component: () => import("@/views/dashboard/RegisterStatsView.vue"),
    meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
  }
];
