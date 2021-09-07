//ONLY FOR ELECTRON
import fs from 'fs-extra';

let path = `${global.APP_PATH}/../configs`;

let Config = {
    init(configs) {
        fs.ensureDir(path);

        for ( let config of configs ) {
            if ( !fs.existsSync(`${path}/${config}.json`) ) {
                fs.writeFileSync(`${path}/${config}.json`, '{}');
            }
        }
    },

    read(config) {
        return JSON.parse(fs.readFileSync(`${path}/${config}.json`, 'utf8'));
    },

    write(config, data) {
        fs.writeFileSync(`${path}/${config}.json`, JSON.stringify(data));
    },

    get(config) {
        return Config.read(config);
    },

    getKey(config, key) {
        let data = Config.read(config);
        return data[key];
    },

    set(config, data) {
        Config.write(config, data);
    },

    setKey(config, key, value) {
        let data = Config.read(config);
        data[key] = value;
        Config.write(config, data);
    },

    deleteKey(config, key) {
        let data = Config.read(config);
        delete data[key];
        Config.write(config, data);
    },

    clear(config) {
        Config.write(config, {});
    },
};

if ( typeof window !== 'undefined' ) {
    window.Config = Config;
}

export default Config;
