import Vue from 'vue';
import VueRouter from 'vue-router';
import Middleware from './Middleware';

Vue.use(VueRouter);

//load routes
let Routes = [];
let context = require.context(`@/routes/`, true, /\.js/);
let files = context.keys();

for ( let j = 0; j < files.length; j++ ) {
    let groups = context(files[j]).default;

    for ( let k = 0; k < groups.length; k++ ) {
        let middleware = groups[k].middleware;

        for ( let l = 0; l < groups[k].routes.length; l++ ) {
            let route = groups[k].routes[l];

            if ( !route.action ) {
                throw `Action missing for ${route.path}`;
            }

            let namespace = '';
            // let action_path = route.action.__file.replace('src/http/actions/', '').split('/');
            // for ( let i = 0; i < action_path.length - 1; i++ ) {
            //     namespace += action_path[i].replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            //         return s.toUpperCase();
            //     }).replace(/ /g, '')+'\\';
            // }

            Routes.push({
                package: route.package ? route.package : '',
                name: namespace + (route.name ? route.name : route.action.name),
                component: route.action,
                path: route.path.replace(/\{([\s\S]+?)\}/g, ':$1'),
                meta: {
                    middleware,
                    settings: route.action.settings ? route.action.settings : {},
                },
            });
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
