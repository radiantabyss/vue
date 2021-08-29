const Middleware = {};
let context = require.context('@/http/middleware/', true, /\.js$/);
context.keys().forEach((key) => {
    let split = key.split('/');
    let name = split[split.length - 1].replace('.js', '').replace('Middleware', '');
    Middleware[name] = context(key).default;
});

function recursion(i, to, from, resolve, reject) {
    //reached end, then everything passed
    if ( i == to.meta.middleware.length ) {
        return resolve();
    }

    //middleare doesnt exist
    if ( !Middleware[to.meta.middleware[i]] ) {
        throw new Error(`${to.meta.middleware[i]} Middleware not found.`);
    }

    //run middleware
    Middleware[to.meta.middleware[i]](to, from)
    .then(() => {
        //resolved, go next
        recursion(i + 1, to, from, resolve, reject);
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

            recursion(0, to, from, resolve, reject);
        });
    }
}
