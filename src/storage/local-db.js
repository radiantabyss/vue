//ONLY FOR ELECTRON
import fs from 'fs-extra';
import { v4 as uuid } from 'uuid';

let LocalDB = {
    init(tables) {
        fs.ensureDir('database');

        for ( let table of tables ) {
            if ( !fs.existsSync(`database/${table}.json`) ) {
                fs.writeFileSync(`database/${table}.json`, '[]');
            }
        }
    },

    read(table) {
        return JSON.parse(fs.readFileSync(`database/${table}.json`, 'utf8'));
    },

    write(table, data) {
        fs.writeFileSync(`database/${table}.json`, JSON.stringify(data));
    },

    create(table, data) {
        data.id = uuid();

        //remove unwanted fields
        delete data._event;

        let items = LocalDB.read(table);
        items.push(data);
        LocalDB.write(table, items);

        return data;
    },

    update(table, id, data) {
        data.id = id;

        //remove unwanted fields
        delete data._event;

        let items = LocalDB.read(table);
        let new_items = [];
        for ( let i = 0; i < items.length; i++ ) {
            if ( items[i].id == data.id ) {
                new_items[i] = data;
            }
            else {
                new_items[i] = items[i];
            }
        }

        LocalDB.write(table, new_items);

        return data;
    },

    find(table, id) {
        let items = LocalDB.read(table);
        for ( let item of items ) {
            if ( item.id == id ) {
                return item;
            }
        }

        return null;
    },

    findBy(table, key, value) {
        let items = LocalDB.read(table);
        for ( let item of items ) {
            if ( item[key] == value ) {
                return item;
            }
        }

        return null;
    },

    get(table, page = 1, per_page = 25, filters = {}) {
        let items = LocalDB.read(table);

        //filter items
        let filtered = [];
        if ( Object.keys(filters).length ) {
            for ( let key in filters ) {
                for ( let item of items ) {
                    if ( item[key] != filters[key] ) {
                        continue;
                    }

                    filtered.push(item);
                }
            }
        }
        else {
            filtered = items;
        }

        let returned = [];
        let start = (page - 1) * per_page;
        let end = page * per_page;
        if ( end > filtered.length ) {
            end = filtered.length;
        }

        for ( let i = start; i < end; i++ ) {
            returned.push(filtered[i]);
        }

        return returned;
    },

    delete(table, id) {
        let items = LocalDB.read(table);
        items = Items.delete(items, id);

        let new_items = [];
        for ( let i = 0; i < items.length; i++ ) {
            if ( items[i].id == id ) {
                continue;
            }

            new_items.push(items[i]);
        }

        LocalDB.write(table, new_items);
    },

    sort(table, from, to) {
        let items = LocalDB.read(table);

        let temp = items[from];
        items[from] = items[to];
        items[to] = temp;

        LocalDB.write(table, items);
    },
}

if ( typeof window !== 'undefined' ) {
    window.LocalDB = LocalDB;
}

export default LocalDB;
