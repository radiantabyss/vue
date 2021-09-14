const ActionsLoader = {
    load() {
        let actions = {};
        let context = require.context('@/http/actions/', true, /\.vue/);

        context.keys().forEach((key) => {
            let split = key.split('/');
            let namespace = split[split.length - 2];
            let namespace_uc = window.ucwords(namespace);
            let name = split[split.length - 1].replace('.vue', '');

            if ( !name.match(/Action/) ) {
                return;
            }

            if ( namespace != '.' ) {
                if ( !actions[namespace_uc] ) {
                    actions[namespace_uc] = {};
                }

                actions[namespace_uc][name] = context(key).default;
            }
            else {
                actions[name] = context(key).default;
            }
        });

        return actions;
    },
};

export default ActionsLoader;
