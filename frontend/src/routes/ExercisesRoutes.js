export default [
    {
        path: "/dashboard/exercises",
        name: "Exercises",
        component: () => import('@/views/dashboard/exercises/MainView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    },
    {
        path: "/dashboard/exercises/create",
        name: "ExercisesCreate",
        component: () => import('@/views/dashboard/exercises/CreateView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    },
    {
        path: "/dashboard/exercises/edit/:id",
        name: "ExercisesEdit",
        component: () => import('@/views/dashboard/exercises/EditView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    }
]