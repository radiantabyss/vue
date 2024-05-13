import Vue from 'vue';

import './Mixins';
import Cookie from './Support/Cookie';
import Directives from './Support/Directives';
import Domain from './Support/Domain';
import Gate from './Support/Gate';
import Helpers from './Support/Helpers';
import Item from './Support/Item';
import Items from './Support/Items';
import StorageHandler from './Support/StorageHandler';

import './Components';
import './Directives';
import './Mixins';

import Alert from './Alert';
import Confirm from './Confirm';
import Request from './Request';

let self = {
    run() {
        window.Item = Item;
        window.Items = Items;

        window.Cookie = Cookie;
        window.Domain = Domain;
        window.StorageHandler = StorageHandler;

        window.Alert = Alert;
        window.Confirm = Confirm;
        window.Request = Request;

        //make usable inside template
        Vue.prototype.Item = Item;
        Vue.prototype.Items = Items;
        Vue.prototype.Domain = Domain;

        //str helpers
        window.Str = Str;
        Vue.prototype.Str = Str;
        for ( let key in Str ) {
            Vue.filter(key, Str[key]);
        }

        window.Gate = Gate;
        Vue.prototype.Gate = Gate;
    }
}

export default self;
