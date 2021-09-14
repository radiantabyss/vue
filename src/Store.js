import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const Modules = {};
let context = require.context('@/store/', true, /\.js$/);
context.keys().forEach((key) => {
    let split = key.split('/');
    let name = split[split.length - 1].replace('.js', '');
    Modules[name] = context(key).default;
});

const Store = new Vuex.Store({
    modules: Modules,
});

export default Store;
