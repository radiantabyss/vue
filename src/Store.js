import Vue from 'vue';
import Vuex from 'vuex';
import Loader from '@/loader';

Vue.use(Vuex);

const Modules = {};
let contexts = Loader.store();

for ( let i = 0; i < contexts.length; i++ ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let split = files[j].split('/');
        let name = split[split.length - 1].replace('.js', '');
        Modules[name] = contexts[i](files[j]).default;
    }
}

const Store = new Vuex.Store({
    modules: Modules,
});

export default Store;
