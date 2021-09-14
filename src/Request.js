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
    if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        request.data = qs.stringify(request.data);
    }
    return request;
});

let request = function(method, edge, payload = {}, display_errors = true, base_url = '', auth_token = '') {
    return new Promise((resolve, reject) => {
        //set default base url
        if ( !base_url ) {
            base_url = process.env.VUE_APP_API_URL;
        }

        //set default auth token
        if ( !auth_token ) {
            auth_token = StorageHandler.getItem('lead_token');
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

        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

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
            if ( url.match(/\?/) ) {
                url += '&token=' + auth_token;
            }
            else {
                url += '?token=' + auth_token;
            }
        }

        //set loading spinner
        let _target_html;
        if ( typeof _event !== 'undefined' ) {
            _target_html = _event.target.innerHTML;

            if ( payload._replace_html ) {
                _event.target.innerHTML = '<i class="sprite-loading spin"></i>';
            }
            else {
                _event.target.innerHTML = _target_html.replace(/<i .*?<\/i>/, '') + ' <i class="sprite-loading spin"></i>';
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
    get(edge, payload = {}, display_errors = true, base_url = '', auth_token = '') {
        return request('GET', edge, payload, display_errors, base_url, auth_token);
    },

    post(edge, payload = {}, display_errors = true, base_url = '', auth_token = '') {
        return request('POST', edge, payload, display_errors, base_url, auth_token);
    },
};

export default Request;
