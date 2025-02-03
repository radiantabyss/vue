import Str from './Support/Str';

let context = import.meta.glob('/app/Directives/**/*.js');

export default async (app) => {
    const files = Object.keys(context);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i].split('/');
        let name = split[split.length - 1].replace('.js', '')
            .replace(/Directive$/, '')
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
            .toLowerCase();

        name = Str.trim(name, '-');

        let module = await context[files[i]]();
        app.directive(name, module.default);
    }
}
