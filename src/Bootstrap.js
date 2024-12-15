import Components from './Components';
import Directives from './Directives';
import Mixins from './Mixins';
import Modals from './Modals';

import Alert from './Alert';
import Cookie from './Support/Cookie';
import Confirm from './Confirm';
import Gate from './Support/Gate';
import Helpers from './Support/Helpers';
import Item from './Support/Item';
import Items from './Support/Items';
import Request from './Request';
import ReactiveStorage from './Support/ReactiveStorage';
import Str from './Support/Str';

import Store from './Store';

export default async (app) => {
    await Components(app);
    await Directives(app);
    await Mixins(app);
    await Modals(app);

    window.Alert = Alert;
    window.Cookie = Cookie;
    window.Confirm = Confirm;
    window.Gate = Gate;
    window.Item = Item;
    window.Items = Items;
    window.Request = Request;
    window.ReactiveStorage = ReactiveStorage;
    window.Str = Str;

    //make usable inside template
    app.config.globalProperties.Item = Item;
    app.config.globalProperties.Items = Items;
    app.config.globalProperties.Gate = Gate;
    app.config.globalProperties.Str = Str;

    await Store(app);
};
