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
	
	removeEmptyKeys(item) {
		let new_item = Array.isArray(item) ? [] : {};
        let count = Array.isArray(item) ? item.length : Object.keys(item).length;
		for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(item) ? i : Object.keys(item)[i];

            if ( item[index] !== '' ) {
                new_item[index] = item[index];
            }
        }

        return new_item;
	}
};

export default Item;
