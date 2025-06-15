export default [
    {
        path: "/dashboard/exercises",
        name: "Exercises",
        component: () => import('@/views/dashboard/exercises/MainView.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
    },
    {
        path: "/dashboard/exercises/create",
        name: "ExercisesCreate",
        component: () => import('@/views/dashboard/exercises/CreateView.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "both" }
    },
    {
        path: "/dashboard/exercises/edit/:id",
        name: "ExercisesEdit",
        component: () => import('@/views/dashboard/exercises/EditView.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "both" }
    },
    {
        path: "/dashboard/train/get/:id",
        name: "ExercisesTrainInfo",
        component: () => import('@/views/dashboard/traines/VerTrain.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
    },
    {
        path: "/dashboard/train/",
        name: "ExercisesTrain",
        component: () => import('@/views/dashboard/traines/RutinasView.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "all" }
    },
    {
        path: "/dashboard/train/create/automatic",
        name: "ExercisesTrainCreateAU",
        component: () => import('@/views/dashboard/traines/CreateAuTrainView.vue'),
        meta: { layout: "clean", requiresAuth: true, requiresRole: "all" }
    },
    {
        path: "/dashboard/train/create/manual/:id",
        name: "ExercisesTrainCreateMA",
        component: () => import('@/views/dashboard/traines/CreateMaTrainView.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "both" }
    },
    {
        path: "/dashboard/train/edit/:id/user/:userId",
        name: "ExercisesTrainEdit",
        component: () => import('@/views/dashboard/traines/EditPlanView.vue'),
        meta: { layout: "dashboard", requiresAuth: true, requiresRole: "both" }
    }
]