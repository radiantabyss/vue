import Helpers from './support/Helpers';
import Item from './support/Item';
import Items from './support/Items';

import Cookie from './storage/Cookie';
import StorageHandler from './storage/StorageHandler';

import Alert from './Alert';
import Request from './Request';


const ServiceProvider = {
    register() {
        //register helpers
        for ( let helper in Helpers ) {
            window[helper] = Helpers[helper];
        }

        window.Item = Item;
        window.Items = Items;

        window.Cookie = Cookie;
        window.StorageHandler = StorageHandler;

        window.Alert = Alert;
        window.Request = Request;
    }
}

export default ServiceProvider;
