export default function(params = {}) {
    return new Promise(resolve => {
        window.dispatchEvent(new CustomEvent('confirm', { detail: {
            resolve,
            params,
        }}));
    });
}
