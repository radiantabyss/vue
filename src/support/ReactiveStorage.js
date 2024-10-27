import { reactive } from 'vue';
import StorageHandler from './StorageHandler';

const self = {
    state: reactive({
        data: {}
    }),

    setItem(key, value) {
        StorageHandler.setItem(key, value);
        self.state.data[key] = value;
    },

    getItem(key) {
        if (!self.state.data[key]) {
            const value = StorageHandler.getItem(key);
            if (value) {
                self.state.data[key] = value;
            }
        }

        return self.state.data[key];
    },

    removeItem(key) {
        StorageHandler.removeItem(key);
        delete self.state.data[key];
    }
};

export default self;
