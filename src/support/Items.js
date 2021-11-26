const Items = {
    pluck(items, key = 'id') {
        let plucked = [];
        for (let i = 0; i < items.length; i++) {
            plucked.push(items[i][key]);
        }

        return plucked;
    },

    groupBy(items, key = 'id') {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if (typeof new_items[items[index][key]] === 'undefined') {
                new_items[items[index][key]] = [];
            }

            new_items[items[index][key]].push(items[index]);
        }

        return new_items;
    },

    find(items, ids) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let single = false;
        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
            single = true;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];
            if ( ids.includes(items[index].id) ) {
                new_items[index] = items[index];
            }
        }

        if ( single ) {
            if ( new_items.length ) {
                return new_items[0];
            }

            return false;
        }

        return new_items;
    },

    findByKey(items, key, value = true) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index][key] == value ) {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    add(items, item, at_first_position = false) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            items = [];
        }

        if ( at_first_position ) {
            items.unshift(item);
        }
        else {
            items.push(item);
        }

        return items;
    },

    addMany(items, added, at_first_position = false) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            items = [];
        }

        if ( at_first_position ) {
            return added.concat(items);
        }
        else {
            return items.concat(added);
        }
    },

    patch(items, data) {
        if ( !data.id ) {
            throw 'ID is required.';
        }

        let id = data.id;
        delete data.id;

        return Items.setKeys(items, id, Object.keys(data), Object.values(data));
    },

    replace(items, item) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index].id == item.id ) {
                new_items[index] = item;
            }
            else {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    delete(items, id) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index].id == id ) {
                continue;
            }

            if ( Array.isArray(items) ) {
                new_items.push(items[index]);
            }
            else {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    deleteByKey(items, key, value) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index][key] != value ) {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    setKey(items, id, key, value) {
        return Items.setKeys(items, id, key, value);
    },

    setKeys(items, ids, keys, values) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
        }

        if ( !Array.isArray(keys) ) {
            keys = [keys];
        }

        if ( !Array.isArray(values) ) {
            values = [values];
        }

        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( ids.includes(items[index].id) ) {
                for ( let j = 0; j < keys.length; j++ ) {
                    items[i][keys[j]] = values[j];
                }
            }
        }

        return items;
    },

    toggleKey(items, id, key) {
        return Items.toggleKeys(items, id, key);
    },

    toggleKeys(items, ids, keys) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
        }

        if ( !Array.isArray(keys) ) {
            keys = [keys];
        }

        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( ids.includes(items[index].id) ) {
                for ( let j = 0; j < keys.length; j++ ) {
                    items[index][keys[j]] = !items[index][keys[j]];
                }
            }
        }

        return items;
    },

    sort(items, from, to) {
        const copy = [...items];
        const valueToMove = copy.splice(from, 1)[0];
        copy.splice(to, 0, valueToMove);

        return copy;
    },
};

export default Items;
