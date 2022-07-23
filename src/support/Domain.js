import Router from './../routing/Router';

let self = {
    get() {
        let split = Router.currentRoute.name.split('\\');
        if ( split.length != 2 ) {
            return '';
        }

        return kebab(split[0]);
    },

    name(is_plural = false) {
        let name = to_words(self.get());
        return is_plural ? plural(name) : name;
    },

    action() {
        let split = Router.currentRoute.name.split('\\');
        return kebab(split[split.length - 1].replace(/Action$/, ''));
    },

    actionName() {
        return to_words(self.action());
    }
}

export default self;
