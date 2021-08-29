const RoutesLoader = {
    load() {
        let routes = [];
        let context = require.context('@/http/routes/', true, /\.js$/);

        context.keys().forEach((key) => {
            let groups = context(key).default;

            for ( let i = 0; i < groups.length; i++ ) {
                let middleware = groups[i].middleware;

                for ( let j = 0; j < groups[i].routes.length; j++ ) {
                    let route = groups[i].routes[j];

                    routes.push({
                        component: route.action,
                        path: route.path.replace(/\{([\s\S]+?)\}/g, ':$1'),
                        meta: {...route.meta, middleware}
                    });
                }
            }
        });

        return routes;
    }
}

export default RoutesLoader;
