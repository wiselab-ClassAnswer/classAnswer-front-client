import { createRouter, createWebHistory } from 'vue-router'
import { SessionUtil } from '@/utils/SessionUtil.js'

const requireRoute = require.context('./routes', false, /\.js$/) // Get js files inside routes folder
const routes = []

requireRoute.keys().forEach(fileName => {
    // Avoid the index.js file
    if (fileName === './index.js') {
        return;
    }

    const route = requireRoute(fileName).default
    routes.push(...route)
})

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    mode: 'history',
    // historyApiFallback: true,
    base: process.env.BASE_URL,
    routes: [...routes]
})


router.beforeEach(function(to, from, next) {
    // console.log(from.path + '->' + to.path);
    if ( from.name === 'Home' ) {
        if ( to.name === 'Login' ) {
            if ( !!SessionUtil.getToken() ) {
                next(false);
            }
        }
    }

    if ( from.name === 'Login' ) {
        if ( to.name !== 'Login' ) {
            if ( !SessionUtil.getToken() ) {
                next(false);
            }
        }
    }

    next();
});

export default router
