import { createRouter, createWebHistory } from 'vue-router';
import Str from './../Support/Str';
import Actions from './Actions';
import Middleware from './Middleware';
import RouteFiles from './RouteFiles';
import Route from './Route';
import RouteCrud from './RouteCrud';

window.RouteFiles = RouteFiles;
window.Route = Route;
window.RouteCrud = RouteCrud;

//load route files
let context = import.meta.glob('/src/Routes/**/*.js');

const loadModules = async () => {
    window.Actions = await Actions();
    const files = Object.keys(context);

    for ( let i = 0; i < files.length; i++ ) {
        let file = files[i].replace('/src/Routes/', '').replace(/\.js$/, '');
        window.__route_file = file;

        if ( !RouteFiles[__route_file] ) {
            RouteFiles[__route_file] = [];
        }

        await context[files[i]]();
    }
}

export default async () => {
    let runMiddleware = await Middleware();

    await loadModules();

    //create router
    const Router = createRouter({
        history: createWebHistory(),
        routes: [],
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

    Router.afterEach((to, from) => {
        //save previous route
        localStorage.setItem('_previous_route', from.fullPath != '/' ? from.fullPath : '');

        //change document title
        let title = to.name.replace(/\//g, ' / ').replace(/Action$/, '');
        if ( to.meta.settings.title ) {
            title = to.meta.settings.title;
        }
        document.title = `${title} :: ${import.meta.env.VITE_NAME}`;
    });

    return { Router, RouteFiles };
};
