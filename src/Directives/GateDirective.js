let self = {
    bind(el, binding) {
        // Create a placeholder comment node
        el.placeholder = document.createComment('gate placeholder');

        let [gate_name, gate_params] = binding.value.split(':');

        // Delay the initial DOM operation to ensure el is in the DOM
        Vue.nextTick(() => {
            if (!el.parentNode) {
                // Early exit if still not in the DOM
                console.warn('Element has no parent node on initial bind.');
                return;
            }

            // Store the original parent node
            el.originalParent = el.parentNode;

            // Initially remove the element if the condition is false
            if (!Gate.allows(gate_name, gate_params)) {
                el.originalParent.replaceChild(el.placeholder, el);
            }
        });
    },
    update(el, binding) {
        let [gate_name, gate_params] = binding.value.split(':');

        // Ensure the element and placeholder are properly managed
        if (Gate.allows(gate_name, gate_params)) {
            // Insert element if condition is true and it's currently replaced by the placeholder
            if (el.placeholder.parentNode) {
                el.originalParent.replaceChild(el, el.placeholder);
            }
        }
        else {
            // Replace element with placeholder if condition is false and element is currently in the DOM
            if (!el.placeholder.parentNode) {
                el.originalParent.replaceChild(el.placeholder, el);
            }
        }
    },
    unbind(el) {
        // Clean up: put the element back if placeholder is in the DOM
        if (el.placeholder.parentNode) {
            el.originalParent.replaceChild(el, el.placeholder);
        }
    },
};

export default self;
