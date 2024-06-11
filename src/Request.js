import axios from 'axios';
import qs from 'qs';

const formatErrors = function(response) {
    let errors = [];
    if ( response && response.data && response.data.errors ) {
        for ( var i in response.data.errors ) {
            if ( typeof response.data.errors[i] === 'object' ) {
                for ( var j in response.data.errors[i] ) {
                    errors.push(response.data.errors[i][j]);
                }
            }
            else {
                errors.push(response.data.errors[i]);
            }
        }
    }
    else if ( response.statusText ) {
        errors.push(response.statusText);
    }

    return errors;
}

axios.interceptors.request.use((request) => {
    if (request.data ) {
        if ( request.headers['Content-Type'] === 'application/x-www-form-urlencoded' ) {
            request.data = qs.stringify(request.data);
        }
        else if ( request.headers['Content-Type'] === 'application/json' ) {
            request.data = JSON.stringify(request.data);
            request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    }
    return request;
});

let request = function(method, edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}, upload_progress = null) {
    return new Promise((resolve, reject) => {
        //set default base url
        if ( !base_url ) {
            base_url = process.env.VUE_APP_BACK_URL;
        }

        //set default auth token
        if ( !auth_token ) {
            auth_token = StorageHandler.getItem('jwt_token');
        }

        //clear previous messages
        if ( method == 'POST' ) {
            Alert.hide();
        }

        if ( !Object.keys(headers).length ) {
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
        }

        //target button
        let _button;
        if ( typeof payload._button !== 'undefined' ) {
            _button = payload._button;
            delete payload._button;
        }

        //event
        let _event;
        if ( typeof payload._event !== 'undefined' ) {
            _event = payload._event;
            _event.preventDefault();

            if ( typeof _button === 'undefined' ) {
                _button = _event.target;
            }

            delete payload._event;
        }

        //check if button is disabled
        if ( typeof _button !== 'undefined' ) {
            if ( _button.disabled ) {
                return;
            }

            _button.disabled = true;
        }

        let data;

        //build url
        let url = base_url + edge;

        if ( method == 'GET' ) {
            url += '?' + qs.stringify(payload);
        }
        else if ( method == 'POST' ) {
            if ( headers['Content-Type'] == 'multipart/form-data' ) {
                data = new FormData()
                for ( let key in payload ) {
                    data.append(key, payload[key]);
                }
            }
            else {
                data = {...payload};
            }
        }

        //set auth token
        if ( auth_token ) {
            if ( typeof auth_token !== 'object' ) {
                auth_token = {
                    jwt_token: auth_token,
                };
            }

            for ( let key in auth_token ) {
                if ( auth_token[key] == '' || auth_token[key] === null ) {
                    continue;
                }

                url += url.match(/\?/) ? '&' : '?';
                url += `${key}=${auth_token[key]}`;
            }
        }

        //set loading spinner
        let _button_html;
        if ( typeof _button !== 'undefined' ) {
            _button_html = _button.innerHTML;

            if ( payload._replace_html ) {
                _button.innerHTML = '<svg class="svg-request-spinner"><use xlink:href="#request-spinner"></use></svg>';
            }
            else {
                _button.innerHTML = _button_html + '&nbsp;<svg class="svg-request-spinner"><use xlink:href="#request-spinner"></use></svg>';
            }
        }

        axios({
            headers,
            method,
            url,
            data,
            onUploadProgress: (e) => {
                if ( !upload_progress ) {
                    return;
                }

                upload_progress(Math.round((e.loaded * 100) / e.total));
            },
        })
        .then((request_response) => {
            //enable event target
            if ( typeof _button !== 'undefined' ) {
                _button.disabled = false;
                _button.innerHTML = _button_html;
            }

            let response = request_response.data;

            if ( response.success ) {
                resolve(response.data);
            }
            else {
                let errors = formatErrors(response);

                if ( display_errors ) {
                    Alert.error(errors.join('<br/>'), 7000);
                }

                reject(response.data.errors);
            }
        })
        .catch((error) => {
            let errors;

            if ( error instanceof TypeError ) {
                errors = [error];
            }
            else {
                errors = formatErrors(error.response);
            }

            if ( display_errors ) {
                Alert.error(errors.join('<br/>'), 7000);
            }

            //enable event target
            if ( typeof _button !== 'undefined' ) {
                _button.disabled = false;
                _button.innerHTML = _button_html;
            }

            reject(error.response.data.errors, error.response.status);
        });
    });
}

let self = {
    get(edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}) {
        return request('GET', edge, payload, display_errors, base_url, auth_token, headers);
    },

    post(edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}) {
        return request('POST', edge, payload, display_errors, base_url, auth_token, headers);
    },

    upload(edge, payload = {}, display_errors = false, upload_progress, base_url = null, auth_token = null, headers = {}) {
        headers['Content-Type'] = 'multipart/form-data';
        return request('POST', edge, payload, display_errors, base_url, auth_token, headers, upload_progress);
    },
};

export default self;
