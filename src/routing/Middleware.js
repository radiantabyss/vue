import Loader from '@/loader';

let Middleware = {};
let contexts = Loader.middleware();

for ( let i = 0; i < contexts.length; i++ ) {
    let files = contexts[i].keys();

    for ( let j = 0; j < files.length; j++ ) {
        let split = files[j].split('/');
        let name = split[split.length - 1].replace('.js', '').replace('Middleware', '');
        Middleware[name] = contexts[i](files[j]).default;
    }
}

function runMiddleware(to, from, resolve, reject, i = 0) {
    //reached end, then everything passed
    if ( i == to.meta.middleware.length ) {
        return resolve();
    }

    //middleware doesnt exist
    if ( !Middleware[to.meta.middleware[i]] ) {
        throw new Error(`${to.meta.middleware[i]} Middleware not found.`);
    }

    //run middleware
    Middleware[to.meta.middleware[i]](to, from)
    .then(() => {
        //resolved, go next
        runMiddleware(to, from, resolve, reject, i + 1);
    })
    .catch((redirect = '/') => {
        reject(redirect);
    });
}

export default {
    run(to, from) {
        return new Promise((resolve, reject) => {
            if ( !to.meta || !to.meta.middleware ) {
                return resolve();
            }

            runMiddleware(to, from, resolve, reject);
        });
    }
}
