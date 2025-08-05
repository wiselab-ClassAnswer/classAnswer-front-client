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
//로그인
{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/cmon/CtchLogin.vue'),
    meta: {
        requiresAuth: false
    }
},
// {
//     path: '/totMonPop',
//     name: '종합현황',
//     component: () => import('@/views/rept/stat/TotMonPop.vue'),
//     meta: {
//         requiresAuth: false
//     }
// },

]