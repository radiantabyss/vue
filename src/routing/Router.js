import Vue from 'vue';
import VueRouter from 'vue-router';
import Loader from '@/loader';
import Middleware from '@lumi/routing/Middleware';

Vue.use(VueRouter);

//load routes
let Routes = [];
let contexts = Loader.routes();

for ( let i = 0; i < contexts.length; i++ ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let groups = contexts[i](files[j]).default;

        for ( let k = 0; k < groups.length; k++ ) {
            let middleware = groups[k].middleware;

            for ( let l = 0; l < groups[k].routes.length; l++ ) {
                let route = groups[k].routes[l];

                Routes.push({
                    package: route.package ? route.package : '',
                    name: route.name ? route.name : route.action.name,
                    component: route.action,
                    path: route.path.replace(/\{([\s\S]+?)\}/g, ':$1'),
                    meta: {...route.meta, middleware}
                });
            }
        }
    }
}

//init dispatcher
const Router = new VueRouter({
    mode: process && process.versions && process.versions.electron ? 'hash' : 'history',
    routes: Routes,
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
