export default [
{
    path: '/',
    name: 'root',
    redirect: '/main',
    meta: {
        requiresAuth: false
    }
},
{
    path: '/main',
    name: 'main',
    component: () => import('@/popup/views/cmon/popup.vue'),
    meta: {
        requiresAuth: false
    }
},
{
    path: '/popup/childWindPop/:userId',
    name: 'popup/childWindPop',
    component: () => import('@/popup/views/users/childWinPop.vue'),
    props: true,
    meta: {
        requiresAuth: false
    }
},
// {
//     path: '/popup/totMonPop/:popupYn',
//     name: '종합현황',
//     component: () => import('@/views/rept/stat/TotMon.vue'),
//     props: true,
//     meta: {
//         requiresAuth: false
//     }
// },
]