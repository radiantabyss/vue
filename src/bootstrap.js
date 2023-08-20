import Vue from 'vue';

import Cookie from './support/Cookie';
import Directives from './support/Directives';
import Domain from './support/Domain';
import Filters from './support/Filters';
import Gate from './support/Gate';
import Helpers from './support/Helpers';
import Item from './support/Item';
import Items from './support/Items';
import StorageHandler from './support/StorageHandler';

import './Components';
import './Modals';

import Alert from './Alert';
import Mixins from './Mixins';
import Request from './Request';

let self = {
    run() {
        window.Item = Item;
        window.Items = Items;

        window.Cookie = Cookie;
        window.Domain = Domain;
        window.StorageHandler = StorageHandler;

        window.Alert = Alert;
        window.Mixins = Mixins;
        window.Request = Request;

        //make usable inside template
        Vue.prototype.Item = Item;
        Vue.prototype.Items = Items;
        Vue.prototype.Domain = Domain;

        Vue.use(Directives);
        Vue.use(Filters);

        window.Gate = Gate;
        Vue.prototype.Gate = Gate;
    }
}

export default self;
