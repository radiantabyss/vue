let sprite_version = import.meta.env.VITE_SPRITE_VERSION;

const formatErrors = function(response) {
    let errors = [];
    if ( response && response.errors ) {
        for ( let i in response.errors ) {
            if ( typeof response.errors[i] === 'object' ) {
                for (let j in response.errors[i]) {
                    errors.push(response.errors[i][j]);
                }
            }
            else {
                errors.push(response.errors[i]);
            }
        }
    }
    else if ( response.statusText ) {
        errors.push(response.statusText);
    }

    return errors;
};

const serializeToURLEncoded = (obj, prefix) => {
    const str = [];
    for ( let p in obj ) {
        if ( obj.hasOwnProperty(p) ) {
            const key = prefix ? `${prefix}[${p}]` : p;
            const value = obj[p];

            if ( typeof value === "object" ) {
                str.push(serializeToURLEncoded(value, key));
            }
            else {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            }
        }
    }
    return str.join("&");
};

const appendFormData = (formData, key, value) => {
    if ( value instanceof Blob ) {
        formData.append(key, value);
    }
    else if ( Array.isArray(value) ) {
        value.forEach((v) => formData.append(`${key}[]`, v));
    }
    else if ( typeof value === 'object' && value !== null ) {
        for ( let subKey in value ) {
            appendFormData(formData, `${key}[${subKey}]`, value[subKey]);
        }
    }
    else {
        formData.append(key, value);
    }
};

const request = function(method, edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}, upload_progress = null) {
    return new Promise((resolve, reject) => {
        if ( !base_url ) {
            base_url = import.meta.env.VITE_BACK_URL;
        }

        if ( !auth_token ) {
            auth_token = localStorage.getItem('jwt_token');
        }

        if ( method === 'POST' ) {
            Alert.hide();
        }

        if ( !Object.keys(headers).length ) {
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
        }

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

        let data;
        let url = base_url + edge;

        if ( method === 'GET' ) {
            url += '?' + new URLSearchParams(payload).toString();
        }
        else if ( method === 'POST' ) {
            if ( headers['Content-Type'] === 'multipart/form-data' ) {
                data = new FormData();

                for (let key in payload) {
                    appendFormData(data, key, payload[key]);
                }

                delete headers['Content-Type'];
            }
            else if ( headers['Content-Type'] === 'application/x-www-form-urlencoded' ) {
                data = serializeToURLEncoded(payload).replace(/\&+$/, '');
            }
            else {
                data = JSON.stringify(payload);
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
        }

        if ( auth_token ) {
            if ( typeof auth_token !== 'object' ) {
                auth_token = { jwt_token: auth_token };
            }
            for ( let key in auth_token ) {
                if ( auth_token[key] !== '' && auth_token[key] !== null ) {
                    url += url.includes('?') ? '&' : '?';
                    url += `${key}=${auth_token[key]}`;
                }
            }
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

        fetch(url, {
            method,
            headers,
            body: method === 'GET' ? undefined : data,
        })
        .then(async (response) => {
            if ( _button !== undefined ) {
                _button.disabled = false;
                _button.innerHTML = _button_html;
            }

            const response_data = await response.json();

            if ( edge.match(/\.json/) ) {
                return resolve(response_data);
            }

            if ( response.ok && response_data.success ) {
                return resolve(response_data.data);
            }

            const errors = formatErrors(response_data);
            if ( display_errors ) {
                Alert.error(errors.join('<br/>'), 7000);
            }

            reject(errors);
        })
        .catch((error) => {
            let errors = [error.message];

            if ( display_errors ) {
                Alert.error(errors.join('<br/>'), 7000);
            }

            if ( _button !== undefined ) {
                _button.disabled = false;
                _button.innerHTML = _button_html;
            }

            reject(errors);
        });
    });
};

let self = {
    get(edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}) {
        return request('GET', edge, payload, display_errors, base_url, auth_token, headers);
    },

    post(edge, payload = {}, display_errors = true, base_url = null, auth_token = null, headers = {}) {
        return request('POST', edge, payload, display_errors, base_url, auth_token, headers);
    },

    upload(edge, payload = {}, display_errors = true, upload_progress, base_url = null, auth_token = null, headers = {}) {
        headers['Content-Type'] = 'multipart/form-data';
        return request('POST', edge, payload, display_errors, base_url, auth_token, headers, upload_progress);
    },
};

export default self;
