let self = {
    show(name, params) {
        window.dispatchEvent(new CustomEvent('modal-show', { detail: {
            name,
            params,
        }}));
    },

    hide(name) {
        window.dispatchEvent(new CustomEvent('modal-hide', { detail: {
            name,
        }}));
    },
};

export default self;
