//electron only

import fs from 'fs-extra';
import { v4 as uuid } from 'uuid';

window.LocalDB = {
    create(table, data) {
        let items;
        data.id = uuid();

        //remove unwanted fields
        delete data._event;

        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        items.push(data);
        fs.writeFileSync(`${DB_PATH}/${table}.json`, JSON.stringify(items));

        return data;
    },

    update(table, id, data) {
        let items;
        data.id = id;

        //remove unwanted fields
        delete data._event;

        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        items = Items.replace(items, data);
        fs.writeFileSync(`${DB_PATH}/${table}.json`, JSON.stringify(items));

        return data;
    },

    find(table, id) {
        let items;
        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        for ( let item of items ) {
            if ( item.id == id ) {
                return item;
            }
        }

        return null;
    },

    findBy(table, key, value) {
        let items;
        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        for ( let item of items ) {
            if ( item[key] == value ) {
                return item;
            }
        }

        return null;
    },

    get(table, page = 1, per_page = 25, filters = {}) {
        let items;
        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        let returned = [];
        let start = (page - 1) * per_page;
        let end = page * per_page;
        if ( end > items.length ) {
            end = items.length;
        }

        for ( let i = start; i < end; i++ ) {
            returned.push(items[i]);
        }

        return returned;
    },

    delete(table, id) {
        let items;
        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        items = Items.delete(items, id);
        fs.writeFileSync(`${DB_PATH}/${table}.json`, JSON.stringify(items));
    },

    sort(table, from, to) {
        let items;
        try {
            items = JSON.parse(fs.readFileSync(`${DB_PATH}/${table}.json`, 'utf8'));
        } catch(e) {
            items = [];
        }

        let temp = items[from];
        items[from] = items[to];
        items[to] = temp;

        fs.writeFileSync(`${DB_PATH}/${table}.json`, JSON.stringify(items));
    }
}
