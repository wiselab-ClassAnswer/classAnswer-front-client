export default [
{
    path: '/',
    name: 'root',
    redirect: '/home',
    meta: {
        requiresAuth: false
    }
},
{
    path: '/index.html',
    name: 'index',
    redirect: '/home',
    meta: {
        requiresAuth: false
    }
},
{
    path: '/home',
    name: 'Home',
    component: () => import("@/views/cmon/Home.vue"),
    meta: {
        requiresAuth: false
    }
},

]