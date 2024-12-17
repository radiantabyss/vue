import Str from './Support/Str';

let context_lumi = import.meta.glob('@lumi-components/Components/**/*.vue');
let context = import.meta.glob('@/Components/**/*.vue');

function getComponentName(file) {
    let split = file.split('/');
    let name = split[split.length - 1].replace('.vue', '')
        .replace(/Component$/, '')
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();

    return Str.trim(name, '-');
}

export default async (app) => {
    //load src components
    let files = Object.keys(context);
    let components = [];

    for ( let i = 0; i < files.length; i++ ) {
        let component = getComponentName(files[i]);
        components.push(component);

        let module = await context[files[i]]();
        app.component(component, module.default);
    }

    //load lumi components
    files = Object.keys(context_lumi);

    for ( let i = 0; i < files.length; i++ ) {
        let component = getComponentName(files[i]);

        //enable component overloading. if component is already defined in src, continue
        if ( components.includes(component) ) {
            continue;
        }

        let module = await context_lumi[files[i]]();
        components.push(component);
        app.component(component, module.default);
    }
}
