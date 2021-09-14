const Alert = {
    show(message, type = 'success', duration = null) {
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

export default Alert;
