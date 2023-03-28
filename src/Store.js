import Vue from 'vue';
import Vuex from 'vuex';
import Loader from '@/loader';

Vue.use(Vuex);

const Modules = {};
let contexts = Loader.store();

for ( let i in contexts ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let split = files[j].split('/');
        split.shift();
        let name = split[split.length - 1].replace('.js', '');
        split.pop();

        //check namespace
        if ( i != '' ) {
            split.unshift(i);
            split.unshift('Package');
        }

        setNamespace(Modules, name, split, contexts[i](files[j]).default);
    }
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
