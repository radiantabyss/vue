let sprite_version = import.meta.env.VITE_SPRITE_VERSION;

const invoke = async function(method, edge, payload = {}, display_errors = false) {
    let _button;
    if ( payload._button !== undefined ) {
        _button = payload._button;
        delete payload._button;
    }

    let _event;
    if ( payload._event !== undefined ) {
        _event = payload._event;
        _event.preventDefault();

        if ( _button === undefined ) {
            _button = _event.target;
        }

        delete payload._event;
    }

    if ( _button !== undefined ) {
        if ( _button.disabled ) {
            return;
        }
        _button.disabled = true;
    }

    let _button_html;
    if ( typeof _button !== 'undefined' ) {
        _button_html = _button.innerHTML;

        if ( payload._replace_html ) {
            _button.innerHTML = `<svg class="svg-request-spinner"><use xlink:href="/sprites.svg?v=${sprite_version}#request-spinner"></use></svg>`;
        }
        else {
            _button.innerHTML += `&nbsp;<svg class="svg-request-spinner"><use xlink:href="/sprites.svg?v=${sprite_version}#request-spinner"></use></svg>`;
        }
    }

    try {
        delete payload._event;
        let data = await IPC.invoke('invoke', {
            method,
            path: edge,
            payload: JSON.stringify(payload),
        });

        if ( _button !== undefined ) {
            _button.disabled = false;
            _button.innerHTML = _button_html;
        }

        return data;
    }
    catch(e) {
        e = e.toString().replace('Error: Error invoking remote method \'invoke\': ', '');

        if ( display_errors ) {
            Alert.error(Str.nl2br(e), 7000);
        }

        if ( _button !== undefined ) {
            _button.disabled = false;
            _button.innerHTML = _button_html;
        }

        throw e;
    }
}

let self = {
    get(edge, payload = {}, display_errors = false) {
        return invoke('GET', edge, payload, display_errors);
    },

    post(edge, payload = {}, display_errors = true) {
        return invoke('POST', edge, payload, display_errors);
    },
};

export default self;
