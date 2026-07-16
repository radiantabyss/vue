import Components from './Components.js';
import Directives from './Directives.js';
import Mixins from './Mixins.js';
import Modals from './Modals.js';

import Alert from './Alert.js';
import Cookie from './Support/Cookie.js';
import Confirm from './Confirm.js';
import Gate from './Support/Gate.js';
import Helpers from './Support/Helpers.js';
import Invoke from './Invoke.js';
import Item from './Support/Item.js';
import Items from './Support/Items.js';
import Modal from './Modal.js';
import Request from './Request.js';
import ReactiveStorage from './Support/ReactiveStorage.js';
import Str from './Support/Str.js';

import Store from './Store.js';

export default async (app) => {
    //helpers
    for ( let key in Helpers ) {
        window[key] = Helpers[key];
        app.config.globalProperties[key] = Helpers[key];
    }

    await Components(app);
    await Directives(app);
    await Mixins(app);
    await Modals(app);

    window.Alert = Alert;
    window.Cookie = Cookie;
    window.Confirm = Confirm;
    window.Gate = Gate;
    window.Invoke = Invoke;
    window.Item = Item;
    window.Items = Items;
    window.Modal = Modal;
    window.Request = Request;
    window.ReactiveStorage = ReactiveStorage;
    window.Str = Str;

    //make usable inside template
    app.config.globalProperties.Item = Item;
    app.config.globalProperties.Items = Items;
    app.config.globalProperties.Gate = Gate;
    app.config.globalProperties.Modal = Modal;
    app.config.globalProperties.Str = Str;

    await Store(app);
};
