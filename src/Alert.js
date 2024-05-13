let self = {
    show(message, type = 'success', duration = null) {
        if ( typeof message != 'string' ) {
            message = message.join('<br/>');
        }

        window.dispatchEvent(new CustomEvent('alert', { detail: {
            message,
            type,
            duration,
        }}));
    },

    success(message, duration = null) {
        self.show(message, 'success', duration);
    },

    error(message, duration = null) {
        self.show(message, 'error', duration);
    },

    info(message, duration = null) {
        self.show(message, 'info', duration);
    },

    warning(message, duration = null) {
        self.show(message, 'warning', duration);
    },

    hide() {
        window.dispatchEvent(new Event('alert-hide'));
    },
};

export default self;
