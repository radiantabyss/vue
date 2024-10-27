let Mixins = {};
let context = import.meta.glob('/src/Mixins/**/*.js');

export default async () => {
    const files = Object.keys(context);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i].split('/');
        let name = split[split.length - 1].replace('.js', '')
            .replace(/Mixin$/, '');

        let module = await context[files[i]]();
        Mixins[name] = module.default;
    }
    window.Mixins = Mixins;
}
