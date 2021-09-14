const StorageHandler = {
    driver: 'localStorage',
    fallback: true,
    keys: {},

    init() {
        if ( !window.StorageHandler.fallback ) {
            return;
        }

        if ( typeof window.memoryStorage === 'undefined' ) {
            return;
        }

        for ( let key in window.memoryStorage ) {
            window.StorageHandler.keys[key] = window.memoryStorage[key];
        }

        delete window.memoryStorage;
    },

    driverIsSupported() {
        let test_key = '__test_key';
        try {
            window[window.StorageHandler.driver].setItem(test_key, test_key);
            window[window.StorageHandler.driver].removeItem(test_key);
            return true;
        } catch(e) {
            return false;
        }
    },

    setItem(key, value) {
        if ( window.StorageHandler.driverIsSupported() ) {
            window[window.StorageHandler.driver].setItem(key, value);
        }

        if ( window.StorageHandler.fallback ) {
            window.StorageHandler.keys[key] = value;
        }
    },

    getItem(key) {
        let value;

        if ( window.StorageHandler.driverIsSupported() ) {
            value = window[window.StorageHandler.driver].getItem(key);
        }

        if ( (typeof value === 'undefined' || value === null || value === '')
            && window.StorageHandler.fallback
            && typeof window.StorageHandler.keys[key] !== 'undefined' )
        {
            value = window.StorageHandler.keys[key];
        }

        return value;
    },

    removeItem(key) {
        if ( window.StorageHandler.driverIsSupported() ) {
            window[window.StorageHandler.driver].removeItem(key);
        }

        delete window.StorageHandler[key];
    },

    clear() {
        if ( window.StorageHandler.driverIsSupported() ) {
            window[window.StorageHandler.driver].clear();
        }

        if ( window.StorageHandler.fallback ) {
            window.StorageHandler.keys = {};
        }
    },

    key(index) {
        if ( window.StorageHandler.driverIsSupported() ) {
            return window[window.StorageHandler.driver].key(index);
        }

        if ( window.StorageHandler.fallback ) {
            return window.StorageHandler.keys[Object.keys(window.StorageHandler.keys)[index]];
        }
    }
};

export default StorageHandler;
