//ONLY FOR ELECTRON
import fs from 'fs-extra';

let Config = {
    init(configs) {
        fs.ensureDir('configs');

        for ( let config of configs ) {
            if ( !fs.existsSync(`configs/${config}.json`) ) {
                fs.writeFileSync(`configs/${config}.json`, '{}');
            }
        }
    },

    ensure(config) {
        if ( fs.existsSync(`configs/${config}.json`) ) {
            return;
        }

        fs.writeFileSync(`configs/${config}.json`, '{}');
    },

    get(config) {
        return JSON.parse(fs.readFileSync(`configs/${config}.json`, 'utf8'));
    },

    getKey(config, key) {
        let data = JSON.parse(fs.readFileSync(`configs/${config}.json`, 'utf8'));
        return data.key;
    },

    set(config, data) {
        fs.writeFileSync(`configs/${config}.json`, JSON.stringify(data));
    },

    setKey(config, key, value) {
        let data = Config.get(config);
        data[key] = value;
        fs.writeFileSync(`configs/${config}.json`, JSON.stringify(config));
    },

    deleteKey(config, key) {
        let data = Config.get(config);
        delete data[key];
        fs.writeFileSync(`configs/${config}.json`, JSON.stringify(data));
    },

    clear(config) {
        fs.writeFileSync(`configs/${config}.json`, '{}');
    },
};

export default Config;
