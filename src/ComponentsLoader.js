import Vue from 'vue';
import Helpers from './support/Helpers';

const ComponentsLoader = {
    load() {
        let context = require.context('@/components/', true, /\.vue$/);

        context.keys().forEach((key) => {
            let split = key.split('/');
            let name = split[split.length - 1].replace('.vue', '').replace(/Component$/g, '').replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
            name = Helpers.trim(name, '-');

            Vue.component(name, context(key).default);
        });
    }
}

export default ComponentsLoader;
