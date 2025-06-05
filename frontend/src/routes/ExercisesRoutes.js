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
    },
    {
        path: "/dashboard/train/get/:id",
        name: "ExercisesTrainInfo",
        component: () => import('@/views/dashboard/exercises/VerTrain.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    },
    {
        path: "/dashboard/train/",
        name: "ExercisesTrain",
        component: () => import('@/views/dashboard/exercises/RutinasView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    },
    {
        path: "/dashboard/train/create/automatic",
        name: "ExercisesTrainCreateAU",
        component: () => import('@/views/dashboard/exercises/CreateAuTrainView.vue'),
        meta: { layout: "clean", requiresAuth: true }
    },
    {
        path: "/dashboard/train/create/manual/:id",
        name: "ExercisesTrainCreateMA",
        component: () => import('@/views/dashboard/exercises/CreateMaTrainView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    },
    {
        path: "/dashboard/train/edit/:id/user/:userId",
        name: "ExercisesTrainEdit",
        component: () => import('@/views/dashboard/exercises/EditPlanView.vue'),
        meta: { layout: "dashboard", requiresAuth: true }
    }
]