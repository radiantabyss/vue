import Vue from 'vue';
import VueRouter from 'vue-router';
import Middleware from './Middleware';
import Actions from './Actions';

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

            //get action
            let split;
            if ( route.action.match(/\./) ) {
                split = route.action.split('.');
            }
            else {
                split = route.action.split('/');
            }

            let name = split[split.length - 1];
            let namespace = split.slice(0, -1);
            let action_name = route.name ? route.name : name;
            let domain = namespace.length ? slug(namespace[0]) : '';

            if ( namespace.length ) {
                action_name = namespace.join('\\') + '\\' + action_name;
            }

            let component = getAction(Actions, name, namespace, action_name);

            Routes.push({
                package: route.package ? route.package : '',
                name: action_name,
                component: component,
                path: route.path.replace(/\{([\s\S]+?)\}/g, ':$1'),
                meta: {
                    domain,
                    middleware,
                    settings: component.settings ? component.settings : {},
                },
            });
        }
    }
}

function getAction(Actions, name, namespace, action_name) {
    if ( !namespace.length ) {
        let Action = Actions[name];
        Action.name = action_name.replace(/\\/g, '.');
        return Action;
    }

    let first = namespace[0];
    namespace.shift();

    return getAction(Actions[first], name, namespace, action_name);
}

function slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";

    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

//init dispatcher
const Router = new VueRouter({
    mode: process && process.versions && process.versions.electron ? 'hash' : 'history',
    routes: Routes,
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    }
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
