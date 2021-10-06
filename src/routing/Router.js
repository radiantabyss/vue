import Vue from 'vue';
import VueRouter from 'vue-router';
import RoutesLoader from './RoutesLoader';
import Middleware from './Middleware';

Vue.use(VueRouter);

//load routes
let routes = RoutesLoader.load();

//init dispatcher
const Router = new VueRouter({
    mode: process && process.versions && process.versions.electron ? 'hash' : 'history',
    routes: routes,
});

//run middleware
Router.beforeEach((to, from, next) => {
    Middleware.run(to, from)
    .then(() => {
        next();
    })
    .catch((redirect) => {
        if ( redirect === false ) {
            next();
        }
        else {
            next(redirect);
        }
    });
});

export default Router;
