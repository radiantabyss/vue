import { reactive } from 'vue';

const self = {
    state: reactive({
        data: {}
    }),

    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        self.state.data[key] = value;
    },

    getItem(key) {
        if (!self.state.data[key]) {
            const value = JSON.parse(localStorage.getItem(key));
            if ( value ) {
                self.state.data[key] = value;
            }
        }

        return self.state.data[key];
    },

    removeItem(key) {
        localStorage.removeItem(key);
        delete self.state.data[key];
    }
};

export default self;
