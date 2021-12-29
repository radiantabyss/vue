import Loader from '@/loader';

let Actions = {};
let contexts = Loader.actions();

for ( let i in contexts ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let split = files[j].split('/');
        split.shift();
        let name = split[split.length - 1].replace('.vue', '');
        split.pop();

        //check namespace
        if ( i != '' ) {
            split.unshift(i);
            split.unshift('Package');
        }

        if ( !name.match(/Action$/) ) {
            continue;
        }

        setNamespace(Actions, name, split, contexts[i](files[j]).default);
    }
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
