const Item = {
	patch(item, data) {
		return Item.setKeys(item, Object.keys(data), Object.values(data));
	},
	
    setKey(item, key, value) {
        return Item.setKeys(item, key, value);
    },

    setKeys(item, keys, values) {
        let not_empty = window.handleEmpty(item);
        if ( not_empty !== true ) {
            return not_empty;
        }

        if ( !Array.isArray(keys) ) {
            keys = [keys];
        }

        if ( !Array.isArray(values) ) {
            values = [values];
        }

        for ( let i = 0; i < keys.length; i++ ) {
            item[keys[i]] = values[i];
        }

        return {...item};
    },
};

export default Item;
