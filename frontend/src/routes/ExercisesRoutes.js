export default [
    {
        path: "/exercises",
        name: "Exercises",
        component: () => import('@/views/dashboard/exercises/MainView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    },
]