let self = {
    show(name, params) {
        window.dispatchEvent(new CustomEvent('modal-show', { detail: {
            name,
            params,
        }}));
        
        document.body.classList.add('no-scroll');
    },

    hide(name) {
        window.dispatchEvent(new CustomEvent('modal-hide', { detail: {
            name,
        }}));

        document.body.classList.remove('no-scroll');
    },
};

export default self;
