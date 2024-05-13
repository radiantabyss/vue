import Vue from 'vue';
import Str from './Support/Str';

//project-specific directives
let context = require.context(`@/Directives/`, true, /\.js/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    let name = split[split.length - 1].replace('.js', '')
        .replace(/Directive$/, '')
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();

    name = Str.trim(name, '-');

    Vue.directive(name, context(files[i]).default);
}
