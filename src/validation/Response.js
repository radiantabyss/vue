let self = {
    error(messages) {
        return {
            success: false,
            messages,
        }
    },

    success() {
        return {
            success: true
        }
    }
}

export default self;
