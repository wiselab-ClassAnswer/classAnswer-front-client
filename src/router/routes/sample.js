export default [
{
    path: '/sample/main',
    name: 'sample/main',
    component: () => import('@/views/sample/main.vue'),
    meta: {
         requiresAuth: false
    }
},
{
    path: '/sample/datepicker',
    name: 'sample/datepicker',
    component: () => import('@/views/sample/picker/datepicker.vue'),
    meta: {
         requiresAuth: false
    }
},
{
    path: '/sample/popLayer',
    name: 'sample/popLayer',
    component: () => import('@/views/sample/layer/dialog.vue'),
    meta: {
         requiresAuth: false
    }
},
{
    path: '/sample/chart',
    name: 'sample/chartMain',
    component: () => import('@/views/sample/chart/chart.vue'),
    meta: {
         requiresAuth: false
    }
},
{
    path: '/sample/paging',
    name: 'sample/paging',
    component: () => import('@/views/sample/paging/infiniteScroll.vue'),
    meta: {
         requiresAuth: false
    }
},
{
    path: '/sample/setParam',
    name: 'sample/setParam',
    component: () => import('@/views/sample/params/setParam.vue'),
    meta: {
         requiresAuth: false
    }
},
{
    path: '/sample/getParam/:id/:name',
    name: 'sample/getParam',
    component: () => import('@/views/sample/params/getParam.vue'),
    props: true,
    meta: {
        requiresAuth: false
    }
},
{
    path: '/sample/loading',
    name: 'sample/loading',
    component: () => import('@/views/sample/loading.vue'),
    meta: {
        requiresAuth: false
    }
},
{
    path: '/popup/sample/swalert',
    name: 'popup/sample/swalert',
    component: () => import('@/views/sample/swalert.vue'),
    meta: {
        requiresAuth: false
    }
},

{
    path: '/barChart',
    name: 'BarChart',
    component: () => import('@/views/sample/classanswer/barChartSample.vue'),
    meta: {
        requiresAuth: false
    }
},
{
    path: '/gaugeChart',
    name: 'GaugeChart',
    component: () => import('@/views/sample/classanswer/GaugeChartSample.vue'),
    meta: {
        requiresAuth: false
    }
},
{
    path: '/raderChart',
    name: 'RaderChart',
    component: () => import('@/views/sample/classanswer/RaderChartSample.vue'),
    meta: {
        requiresAuth: false
    }
},
]