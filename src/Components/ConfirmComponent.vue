<script>
export default {
    name: 'ConfirmComponent',
    data() {
        return {
            is_visible: false,
            resolve: '',

            question: '',
            css_class: '',
            button_text: '',
            button_class: '',
            cancel_text: '',
        }
    },
    computed: {
        computed_css_class() {
            let css_class = `${this.css_class}`;

            if ( this.is_visible ) {
                css_class += ' confirm--visible';
            }

            return css_class;
        }
    },
    methods: {
        confirm() {
            this.resolve();
            this.hide();
        },

        hide() {
            this.is_visible = false;
        },
    },
    mounted() {
        window.addEventListener('confirm', (e) => {
            this.is_visible = true;

            this.resolve = e.detail.resolve;

            this.question = e.detail.params.question || __('Are you sure you want to delete this item?');
            this.button_text = e.detail.params.button_text || __('Delete');
            this.button_class = e.detail.params.button_class || 'btn--red';
            this.cancel_text = e.detail.params.cancel_text || __('Cancel');
            this.css_class = e.detail.params.css_class || '';
        });

        window.addEventListener('confirm-hide', this.hide);
    },
}
</script>

<template>
<div class="confirm" :class="computed_css_class">
    <div class="confirm__content">
        <a @click="hide" class="confirm__close">
            <sprite id="x" class="small" />
        </a>

        <div class="subtitle text-center">
            {{ question }}
        </div>

        <div class="mt-60 text-center">
            <a @click="confirm" class="btn btn--auto" :class="button_class">{{ button_text }}</a>
            <div class="mt-20">
                <a @click="hide">{{ cancel_text }}</a>
            </div>
        </div>
    </div>
</div>
</template>
