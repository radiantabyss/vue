import Vue from 'vue';
import VueRouter from 'vue-router';
import Middleware from './Middleware';
import Actions from './Actions';
import StorageHandler from './../Support/StorageHandler';

Vue.use(VueRouter);

//load routes
let Routes = [];
let context = require.context(`@/Routes/`, true, /\.js/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let groups = context(files[i]).default;

    for ( let j = 0; j < groups.length; j++ ) {
        let middleware = groups[j].middleware;

        for ( let k = 0; k < groups[j].routes.length; k++ ) {
            let route = groups[j].routes[k];

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
        try {
            let Action = Actions[name];
            Action.name = action_name.replace(/\\/g, '.');
            return Action;
        }
        catch(e) {
            throw `Action ${action_name} doesn't exist.`;
        }
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
    mode: typeof IS_ELECTRON != 'undefined' && IS_ELECTRON ? 'hash' : 'history',
    routes: Routes,
    duplicateNavigationPolicy: 'reload',
    scrollBehavior(to, from, scroll) {
        if ( (to.meta.settings && to.meta.settings.disable_scroll)
            || (from.name == to.name && (!to.meta.settings || !to.meta.settings.force_scroll)) ) {
            return scroll;
        }

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
            Router.push(redirect);
        }
    });
});

//save previous route
Router.afterEach((to, from) => {
    StorageHandler.setItem('_previous_route', from.fullPath != '/' ? from.fullPath : '');
});

export default Router;
