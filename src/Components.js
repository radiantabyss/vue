import Vue from 'vue';
import Str from './Support/Str';

//default components
import AlertComponent from './Components/AlertComponent';
import ConfirmComponent from './Components/ConfirmComponent';
import GateComponent from './Components/GateComponent';
import PermissionComponent from './Components/PermissionComponent';

//project-specific components
let context = require.context('@/Components/', true, /\.vue/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    let name = split[split.length - 1].replace('.vue', '')
        .replace(/Component$/, '')
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();

    name = Str.trim(name, '-');

    Vue.component(name, context(files[i]).default);
}
