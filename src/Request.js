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

let request = function(method, edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}) {
    return new Promise((resolve, reject) => {
        //set default base url
        if ( !base_url ) {
            base_url = process.env.VUE_APP_API_URL;
        }

        //set default auth token
        if ( !auth_token ) {
            auth_token = StorageHandler.getItem('jwt_token');
        }

        //clear previous messages
        if ( method == 'POST' ) {
            Alert.hide();
        }

        //disable event target
        let _event;
        if ( typeof payload._event !== 'undefined' ) {
            _event = payload._event;
            _event.preventDefault();

            if ( _event.target.disabled ) {
                return;
            }

            _event.target.disabled = true;
            delete payload._event;
        }

        if ( !Object.keys(headers).length ) {
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
        }

        let data = {};

        //build url
        let url = base_url + edge;

        if ( method == 'GET' ) {
            url += '?' + qs.stringify(payload);
        }
        else if ( method == 'POST' ) {
            data = {...payload};
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
        let _target_html;
        if ( typeof _event !== 'undefined' ) {
            _target_html = _event.target.innerHTML;

            if ( payload._replace_html ) {
                _event.target.innerHTML = '<svg class="request-spinner"><use xlink:href="#request-spinner"></use></svg>';
            }
            else {
                _event.target.innerHTML = _target_html.replace(/<svg .*?<\/svg>/, '') + '&nbsp;<svg class="request-spinner"><use xlink:href="#request-spinner"></use></svg>';
            }
        }

        axios({
            headers,
            method,
            url,
            data,
        })
        .then((request_response) => {
            //enable event target
            if ( typeof _event !== 'undefined' ) {
                _event.target.disabled = false;
                _event.target.innerHTML = _target_html;
            }

            let response = request_response.data;

            if ( response.success ) {
                resolve(response.data);
            }
            else {
                let errors = formatErrors(response);

                if ( display_errors  ) {
                    Alert.show(errors.join('<br/>'), 'error', 7000, _event.target);
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
                let target = _event ? _event.target : null;
                Alert.show(errors.join('<br/>'), 'error', 7000, target);
            }

            //enable event target
            if ( typeof _event !== 'undefined' ) {
                _event.target.disabled = false;
                _event.target.innerHTML = _target_html;
            }

            reject(error.response.data.errors, error.response.status);
        });
    });
}

const Request = {
    get(edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}) {
        return request('GET', edge, payload, display_errors, base_url, auth_token, headers);
    },

    post(edge, payload = {}, display_errors = false, base_url = null, auth_token = null, headers = {}) {
        return request('POST', edge, payload, display_errors, base_url, auth_token, headers);
    },
};

export default Request;
