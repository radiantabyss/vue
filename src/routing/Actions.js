let Actions = {};
let context = require.context(`@/Domains/`, true, /\.vue/);
let files = context.keys();

for ( let i = 0; i < files.length; i++ ) {
    let split = files[i].split('/');
    split.shift();
    let name = split[split.length - 1].replace('.vue', '');
    split.pop();
    split.pop();

    if ( !name.match(/Action$/) || name == 'Action' ) {
        continue;
    }

    setNamespace(Actions, name, split, context(files[i]).default);
}

function setNamespace(Actions, name, namespace, context) {
    if ( !namespace.length ) {
        Actions[name] = context;
        return;
    }

    let first = namespace[0].replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
        return s.toUpperCase();
    }).replace(/ /g, '');

    namespace.shift();

    if ( !Actions[first] ) {
        Actions[first] = {};
    }

    setNamespace(Actions[first], name, namespace, context);
}

export default Actions;
