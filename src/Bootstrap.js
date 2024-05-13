import Vue from 'vue';

import './Components';
import './Directives';
import './Mixins';

import Alert from './Alert';
import Cookie from './Support/Cookie';
import Confirm from './Confirm';
import Domain from './Support/Domain';
import Gate from './Support/Gate';
import Helpers from './Support/Helpers';
import Item from './Support/Item';
import Items from './Support/Items';
import Request from './Request';
import StorageHandler from './Support/StorageHandler';
import Str from './Support/Str';

let self = {
    run() {
        window.Alert = Alert;
        window.Cookie = Cookie;
        window.Confirm = Confirm;
        window.Domain = Domain;
        window.Gate = Gate;
        window.Item = Item;
        window.Items = Items;
        window.Request = Request;
        window.StorageHandler = StorageHandler;
        window.Str = Str;

        //make usable inside template
        Vue.prototype.Item = Item;
        Vue.prototype.Items = Items;
        Vue.prototype.Domain = Domain;
        Vue.prototype.Gate = Gate;
        Vue.prototype.Str = Str;

        //str helpers
        for ( let key in Str ) {
            Vue.filter(key, Str[key]);
        }
    }
}

export default self;
