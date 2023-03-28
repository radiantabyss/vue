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

    hide() {
        window.dispatchEvent(new Event('alert-hide'));
    },
};

export default self;
