import { createRouter, createWebHistory } from 'vue-router';
import Middleware from './Middleware';
import Actions from './Actions';
import Str from './../Support/Str';

//load routes
let Routes = [];
let context = import.meta.glob('/src/Routes/**/*.js');

const loadModules = async () => {
    //load actions
    let actions = await Actions();

    const files = Object.keys(context);

    for ( let i = 0; i < files.length; i++ ) {
        let module = await context[files[i]]();
        let groups = module.default;

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
                let domain = namespace.length ? Str.slug(namespace[0]) : '';

                if ( namespace.length ) {
                    action_name = namespace.join('\\') + '\\' + action_name;
                }

                let component = getAction(actions, name, namespace, action_name);

                let file = files[i].replace('/src/Routes/', '').replace(/\.js$/, '');
                if ( !Routes[file] ) {
                    Routes[file] = [];
                }

                Routes[file].push({
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
}

function getAction(actions, name, namespace, action_name) {
    if ( !namespace.length ) {
        try {
            let action = actions[name];

            action.name = action_name.replace(/\\/g, '.');
            return action;
        }
        catch(e) {
            throw `Action ${action_name} doesn't exist.`;
        }
    }

    let first = namespace[0];
    namespace.shift();

    return getAction(actions[first], name, namespace, action_name);
}

export default async () => {
    let runMiddleware = await Middleware();

    await loadModules();

    //create router
    const Router = createRouter({
        history: createWebHistory(),
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
        },
    });

    //run middleware
    Router.beforeEach(async (to, from, next) => {
        try {
            await runMiddleware(to, from);
            next();
        }
        catch(redirect) {
            if ( redirect === false || to.path == redirect ) {
                return next();
            }

            next({path: redirect});
        }
    });

    //save previous route
    Router.afterEach((to, from) => {
        localStorage.setItem('_previous_route', from.fullPath != '/' ? from.fullPath : '');
    });

    return { Router, Routes };
};
