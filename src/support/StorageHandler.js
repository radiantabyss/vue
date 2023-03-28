let self = {
    driver: 'localStorage',
    fallback: true,
    keys: {},

    init() {
        if ( !self.fallback ) {
            return;
        }

        if ( typeof window.memoryStorage === 'undefined' ) {
            return;
        }

        for ( let key in window.memoryStorage ) {
            self.keys[key] = window.memoryStorage[key];
        }

        delete window.memoryStorage;
    },

    driverIsSupported() {
        let test_key = '__test_key';
        try {
            window[self.driver].setItem(test_key, test_key);
            window[self.driver].removeItem(test_key);
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

        if ( self.driverIsSupported() ) {
            window[self.driver].setItem(key, value);
        }

        if ( self.fallback ) {
            self.keys[key] = value;
        }
    },

    getItem(key) {
        let value;

        if ( self.driverIsSupported() ) {
            value = window[self.driver].getItem(key);
        }

        if ( (typeof value === 'undefined' || value === null || value === '')
            && self.fallback
            && typeof self.keys[key] !== 'undefined' )
        {
            value = self.keys[key];
        }

        try {
          let parsed = JSON.parse(value);
          value = parsed;
        }
        catch(e) {}

        return value;
    },

    removeItem(key) {
        if ( self.driverIsSupported() ) {
            window[self.driver].removeItem(key);
        }

        if ( self.fallback ) {
            delete self.keys[key];
        }
    },

    clear() {
        if ( self.driverIsSupported() ) {
            window[self.driver].clear();
        }

        if ( self.fallback ) {
            self.keys = {};
        }
    },

    key(index) {
        if ( self.driverIsSupported() ) {
            return window[self.driver].key(index);
        }

        if ( self.fallback ) {
            return self.keys[Object.keys(self.keys)[index]];
        }
    }
};

export default self;
