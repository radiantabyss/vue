const StorageHandler = {
    driver: 'localStorage',
    fallback: true,
    keys: {},

    init() {
        if ( !StorageHandler.fallback ) {
            return;
        }

        if ( typeof window.memoryStorage === 'undefined' ) {
            return;
        }

        for ( let key in window.memoryStorage ) {
            StorageHandler.keys[key] = window.memoryStorage[key];
        }

        delete window.memoryStorage;
    },

    driverIsSupported() {
        let test_key = '__test_key';
        try {
            window[StorageHandler.driver].setItem(test_key, test_key);
            window[StorageHandler.driver].removeItem(test_key);
            return true;
        }
        catch(e) {
            return false;
        }
    },

    setItem(key, value) {
        if ( typeof value !== 'string' ) {
            value = JSON.stringify(value);
        }

        if ( StorageHandler.driverIsSupported() ) {
            window[StorageHandler.driver].setItem(key, value);
        }

        if ( StorageHandler.fallback ) {
            StorageHandler.keys[key] = value;
        }
    },

    getItem(key) {
        let value;

        if ( StorageHandler.driverIsSupported() ) {
            value = window[StorageHandler.driver].getItem(key);
        }

        if ( (typeof value === 'undefined' || value === null || value === '')
            && StorageHandler.fallback
            && typeof StorageHandler.keys[key] !== 'undefined' )
        {
            value = StorageHandler.keys[key];
        }

        try {
          let parsed = JSON.parse(value);
          value = parsed;
        }
        catch(e) {}

        return value;
    },

    removeItem(key) {
        if ( StorageHandler.driverIsSupported() ) {
            window[StorageHandler.driver].removeItem(key);
        }

        delete StorageHandler[key];
    },

    clear() {
        if ( StorageHandler.driverIsSupported() ) {
            window[StorageHandler.driver].clear();
        }

        if ( StorageHandler.fallback ) {
            StorageHandler.keys = {};
        }
    },

    key(index) {
        if ( StorageHandler.driverIsSupported() ) {
            return window[StorageHandler.driver].key(index);
        }

        if ( StorageHandler.fallback ) {
            return StorageHandler.keys[Object.keys(StorageHandler.keys)[index]];
        }
    }
};

export default StorageHandler;
