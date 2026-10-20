let self = {
    get(key) {
        key = key + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(key) == 0) return c.substring(key.length,c.length);
        }
        return null;
    },

    set(key, value, duration = 1) {
        var expires = "";
        if ( duration ) {
            var date = new Date();
            date.setTime(date.getTime() + (duration*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + (value || "")  + expires + "; path=/;domain="+window.location.host.replace(':8080', '');
    },

    delete(key) {
        self.set(key, null, -1);
    },
};

export default self;
