import Vue from 'vue';
import VueRouter from 'vue-router';
import RoutesLoader from './routes-loader';
import Middleware from './middleware';
import NotFoundAction from '@/http/actions/static/NotFoundAction.vue';

Vue.use(VueRouter);

//load routes
let routes = RoutesLoader.load();

//add not found route
routes.push({
    name: 'NotFound',
    component: NotFoundAction,
    path: '*'
});

//init dispatcher
const Dispatcher = new VueRouter({
    mode: 'history',
    routes: routes,
});

//run middleware
Dispatcher.beforeEach((to, from, next) => {
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

export default Dispatcher;
