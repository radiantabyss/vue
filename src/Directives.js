import Vue from 'vue';

//default directives
import ClosableDirective from './Directives/ClosableDirective';
import FocusDirective from './Directives/FocusDirective';
import GateDirective from './Directives/GateDirective';
import PermissionDirective from './Directives/PermissionDirective';

Vue.directive('closable', ClosableDirective);
Vue.directive('focus', FocusDirective);
Vue.directive('gate', GateDirective);
Vue.directive('permission', PermissionDirective);

//project-specific directives
let context = require.context(`@/Directives/`, true, /\.js/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    let name = split[split.length - 1].replace('.js', '')
        .replace(/Directive$/, '')
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();

    name = window.trim(name, '-');

    Vue.directive(name, context(files[i]).default);
}
