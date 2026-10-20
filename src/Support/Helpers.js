let self = {
    array_unique(arr) {
        return [...new Set(arr)];
    },

    sprite(id, css_class = '') {
        let url = import.meta.env.MODE == 'development' ? '/sprites.svg' : '';
        return `<svg class="svg-${id} ${css_class}"><use xlink:href="${url}#${id}"></use></svg>`;
    },
}

export default self;
