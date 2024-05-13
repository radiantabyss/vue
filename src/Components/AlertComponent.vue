<script>
export default {
    name: 'AlertComponent',
    data() {
        return {
            is_visible: false,
            message: '',
            type: 'success',
            duration: null,
            timeout: null,
        }
    },
    computed: {
        css_class() {
            let css_class = `${this.type}`;

            if ( this.is_visible ) {
                css_class += ' alert--visible';
            }

            return css_class;
        }
    },
    methods: {
        hide() {
            clearTimeout(this.timeout);
            this.is_visible = false;
        },
    },
    mounted() {
        window.addEventListener('alert', (e) => {
            this.is_visible = true;
            this.message = e.detail.message;
            this.type = e.detail.type;
            this.duration = e.detail.duration;

            clearTimeout(this.timeout);

            if ( !this.duration ) {
                this.duration = 7000;
            }

            this.timeout = setTimeout(() => {
                this.is_visible = false;
            }, this.duration);
        });

        window.addEventListener('alert-hide', () => {
            clearTimeout(this.timeout);
            this.is_visible = false;
        });
    },
}
</script>

<template>
<div class="alert" :class="css_class">
    <a @click="hide" class="alert__close icon-link"><sprite id="x" /></a>
    <sprite :id="type" /> <div v-html="message"></div>
</div>
</template>
