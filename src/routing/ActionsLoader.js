const ActionsLoader = {
    load() {
        let actions = {};
        let context = require.context('@/http/actions/', true, /\.vue/);

        context.keys().forEach((key) => {
            let split = key.split('/');
            split.shift();
            let name = split[split.length - 1].replace('.vue', '');
            split.pop();

            if ( !name.match(/Action$/) ) {
                return;
            }

            ActionsLoader.setNamespace(actions, name, split, context(key).default);
        });

        return actions;
    },

    //private
    setNamespace(actions, name, namespace, context) {
        if ( !namespace.length ) {
            actions[name] = context;
            return;
        }

        let first = namespace[0].replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            return s.toUpperCase();
        }).replace(/ /g, '');

        namespace.shift();

        if ( !actions[first] ) {
            actions[first] = {};
        }

        ActionsLoader.setNamespace(actions[first], name, namespace, context);
    }
};

export default ActionsLoader;
