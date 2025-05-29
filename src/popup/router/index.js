import { createRouter, createWebHistory } from 'vue-router'

const requireRoute = require.context('./routes', false, /\.js$/) // Get js files inside routes folder
const routes = []

requireRoute.keys().forEach(fileName => {
    // Avoid the index.js file
    if (fileName === './index.js') {
        return;
    }
    const route = requireRoute(fileName).default;
    routes.push(...route);
})

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    // mode: 'history',
    routes: [...routes]
})


router.beforeEach(function(to, from, next) {
    // console.log('popup router:' + from.path + '->' + to.path);
    next();
});

export default router
