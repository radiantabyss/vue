import Vue from 'vue';
import Loader from '@/loader';
import Helpers from '@lumi/support/Helpers';

let contexts = Loader.modals();

for ( let i = 0; i < contexts.length; i++ ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let split = files[j].split('/');
        let name = split[split.length - 1].replace('.vue', '')
            .replace(/Component$/g, '')
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
            .toLowerCase();

        name = Helpers.trim(name, '-');

        Vue.component(name, contexts[i](files[j]).default);
    }
}
