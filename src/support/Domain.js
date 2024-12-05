import Str from './Str';

let self = {
    get() {
        let split = Router.currentRoute.value.name.split('/');
        split.pop();

        if ( !split.length ) {
            return '';
        }

        let url = '';
        for ( let i = 0; i < split.length; i++ ) {
            url += `/${Str.kebab(split[i])}`;
        }

        return url;
    },

    name(is_plural = false) {
        let split = Router.currentRoute.value.name.split('/');
        split.pop();

        let name = '';
        for ( let i = 0; i < split.length; i++ ) {
            name += Str.ucwords(split[i]) + ' ';
        }

        name = name.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? ' ' : ''}${letter}`
            : letter;
        })
        .join('')
        .trim()
        .replace(/\s+/, ' ');

        return is_plural ? Str.plural(name) : name;
    },

    url(create_update = false) {
        let split = Router.currentRoute.value.name.split('/');
        split.pop();

        if ( !split.length ) {
            return '';
        }

        let url = '';
        for ( let i = 0; i < split.length; i++ ) {
            url += `/${Str.kebab(split[i])}`;
        }

        if ( create_update ) {
            return `${url}/${Router.currentRoute.value.name.match(/Edit/) ? 'update/' + Router.currentRoute.value.params.id : 'create'}`;
        }

        return url;
    },

    action() {
        let split = Router.currentRoute.value.name.split('/');
        return Str.kebab(split[split.length - 1].replace(/Action$/, ''));
    },

    actionName() {
        return Str.ucwords(self.action());
    }
}

export default self;
