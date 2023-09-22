let handleOutsideClick;

const Directives = {
    closable: {
        bind (el, binding, vnode) {
            // Here's the click/touchstart handler
            // (it is registered below)
            handleOutsideClick = (e) => {
                e.stopPropagation()
                // Get the handler method name and the exclude array
                // from the object used in v-closable
                const { handler, exclude } = binding.value
                // This variable indicates if the clicked element is excluded
                let clickedOnExcludedEl = false

                function checkExcluded(el, target) {
                    if (el._isVue) {
                        el.$children.forEach(child => checkExcluded(child.$el, target));
                    }
                    else if (el.contains(target)) {
                        clickedOnExcludedEl = true;
                    }
                }

                exclude.forEach(refName => {
                    const excludedEl = vnode.context.$refs[refName];
                    if (excludedEl) {
                        checkExcluded(excludedEl, e.target);
                    }
                });

                if (!el.contains(e.target) && !clickedOnExcludedEl) {
                    vnode.context[handler]();
                }
            }
            // Register click/touchstart event listeners on the whole page
            document.addEventListener('click', handleOutsideClick)
            document.addEventListener('touchstart', handleOutsideClick)
        },
        unbind () {
            // If the element that has v-closable is removed, then
            // unbind click/touchstart listeners from the whole page
            document.removeEventListener('click', handleOutsideClick)
            document.removeEventListener('touchstart', handleOutsideClick)
        }
    },
}

export default {
    install(Vue) {
        for ( let key in Directives ) {
            Vue.directive(key, Directives[key]);
        }
    }
};
