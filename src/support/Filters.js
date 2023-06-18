let self = {
    /*helpers from https://github.com/validatorjs/validator.js*/
    ltrim(str, chars) {
        const pattern = chars ? new RegExp(`^[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+`, 'g') : /^\s+/g;
        return `${str}`.replace(pattern, '');
    },

    rtrim(str, chars) {
        const pattern = chars ? new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`, 'g') : /(\s)+$/g;
        return `${str}`.replace(pattern, '');
    },

    trim(str, chars) {
        return self.rtrim(self.ltrim(`${str}`, chars), chars);
    },
    /*end helpers from https://github.com/validatorjs/validator.js*/

    ucwords(str) {
        return `${str}`.replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            return s.toUpperCase();
        });
    },

    to_words(str) {
        return self.ucwords(`${str}`);
    },

    camel(str) {
        return `${str}`.replace(/-./g, x=>x[1].toUpperCase());
    },

    pascal(str) {
        return `${str}`
            .toLowerCase()
            .replace(new RegExp(/[-_]+/, 'g'), ' ')
            .replace(new RegExp(/[^\w\s]/, 'g'), '')
            .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
            .replace(new RegExp(/\w/), s => s.toUpperCase());
    },

    kebab(str) {
        return `${str}`.replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    },

    mysql_date() {
        return new Date().toJSON().slice(0, 10);
    },

    mysql_datetime() {
        return new Date().toJSON().slice(0, 19).replace('T', ' ');
    },

    plural(str) {
        str = self.ucwords(str);

        if ( str.match(/y$/) ) {
            return str.replace(/y$/, 'ies');
        }

        if ( str.match(/x$/) ) {
            return str.replace(/x$/, 'xes');
        }

        return str+'s';
    },
}

//register filters
for ( let filter in self ) {
    window[filter] = self[filter];
}

export default {
    install(Vue) {
        for ( let filter in self ) {
            Vue.filter(filter, self[filter]);
        }
    }
}
