import Vue from 'vue';

let context = require.context(`@/Domains/Common/Components/`, true, /\.vue/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    let name = split[split.length - 1].replace('.vue', '')
        .replace(/Component$/g, '')
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();

    name = window.trim(name, '-');

    Vue.component(name, context(files[i]).default);
}
