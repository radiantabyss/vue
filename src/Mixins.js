let Mixins = {};
let context = require.context(`@/Domains/Common/Mixins/`, true, /\.js/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    let name = split[split.length - 1].replace('.js', '').replace('Mixin', '');

    Mixins[name] = context(files[i]).default;
}

window.Mixins = Mixins;
