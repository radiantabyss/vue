import Vue from 'vue';
import Loader from '@/loader';
import Helpers from './support/Helpers';

let contexts = Loader.modals();

for ( let i in contexts ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let split = files[j].split('/');
        let name = split[split.length - 1].replace('.vue', '')
            .replace(/Component$/g, '')
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
            .toLowerCase();

        name = Helpers.trim(name, '-');

        if ( i != '' ) {
            let package_name = Helpers.trim(i.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase(), '-');
            name = `${package_name}-${name}`;
        }

        Vue.component(name, contexts[i](files[j]).default);
    }
}
