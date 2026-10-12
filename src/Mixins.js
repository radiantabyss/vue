let Mixins = {};
let context = import.meta.glob('/app/Mixins/**/*.js', { eager: true });

//populate at module evaluation so eagerly loaded components can use Mixins.X in their definition
const files = Object.keys(context);

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    let name = split[split.length - 1].replace('.js', '')
        .replace(/Mixin$/, '');

    Mixins[name] = context[files[i]].default;
}
window.Mixins = Mixins;

export default async () => {
    window.Mixins = Mixins;
}
