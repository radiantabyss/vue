import Router from './../routing/Router';

let self = {
    get() {
        let split = Router.currentRoute.name.split('\\');
        split.pop();

        if ( !split.length ) {
            return '';
        }

        let url = '';
        for ( let i = 0; i < split.length; i++ ) {
            url += `/${kebab(split[i])}`;
        }

        return url;
    },

    name(is_plural = false) {
        let split = Router.currentRoute.name.split('\\');
        split.pop();

        let name = '';
        for ( let i = 0; i < split.length; i++ ) {
            name += to_words(split[i]) + ' ';
        }

        name = name.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? ' ' : ''}${letter}`
            : letter;
        })
        .join('')
        .trim()
        .replace(/\s+/, ' ');

        return is_plural ? plural(name) : name;
    },

    url(create_update = false) {
        let split = Router.currentRoute.name.split('\\');
        split.pop();

        if ( !split.length ) {
            return '';
        }

        let url = '';
        for ( let i = 0; i < split.length; i++ ) {
            url += `/${kebab(split[i])}`;
        }

        if ( create_update ) {
            return `${url}/${Router.currentRoute.name.match(/Edit/) ? 'update/' + Router.currentRoute.params.id : 'create'}`;
        }

        return url;
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
