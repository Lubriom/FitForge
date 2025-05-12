export default [
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import('@/views/dashboard/MainView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    }
]