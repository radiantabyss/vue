let self = {
    dmp(text) {
        // eslint-disable-next-line
        console.log(text);
    },

    handleEmpty(items) {
        if ( items === false ) {
            return false;
        }

        if ( items === null ) {
            return null;
        }

        if ( Array.isArray(items) && !items.length ) {
            return [];
        }

        if ( !Array.isArray(items) && !Object.keys(items).length ) {
            return {};
        }

        return true;
    },

    array_unique(arr) {
        return [...new Set(arr)];
    },
}

for ( let helper in self ) {
    window[helper] = self[helper];
}
