import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const Modules = {};
let context = require.context(`@/Store/`, true, /\.js/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    split.shift();
    let name = split[split.length - 1].replace('.js', '');
    split.pop();

    setNamespace(Modules, name, split, context(files[i]).default);
}

function setNamespace(Modules, name, namespace, context) {
    if ( !namespace.length ) {
        Modules[name] = context;
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

    setNamespace(Modules[first].modules, name, namespace, context);
}

let self = new Vuex.Store({
    modules: Modules,
});

export default self;
