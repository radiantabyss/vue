import { createStore } from 'vuex';

const Modules = {};
let context = import.meta.glob('/src/Store/**/*.js');

const loadModules = async () => {
    const files = Object.keys(context);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i].split('/');
        split.shift();
        split.shift();
        split.shift();

        let name = split[split.length - 1].replace('.js', '');
        split.pop();

        let module = await context[files[i]]();
        setNamespace(Modules, name, split, module);
    }
}

function setNamespace(Modules, name, namespace, module) {
    if ( !namespace.length ) {
        Modules[name] = module.default;
        return;
    }

    let first = namespace[0].replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
        return s.toUpperCase();
    }).replace(/ /g, '');

    namespace.shift();

    if ( !Modules[first] ) {
        Modules[first] = {
            namespaced: true,
            modules: {},
        };
    }

    setNamespace(Modules[first].modules, name, namespace, module);
}

export default async (app) => {
    await loadModules();

    const Store = createStore({
        modules: Modules,
    });

    window.Store = Store;
    app.use(Store);
};
