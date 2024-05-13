<script>
export default {
    name: 'GateComponent',
}
</script>

<template>
<span v-if="Gate.allows(Object.keys(this.$attrs)[0], this.$attrs[Object.keys(this.$attrs)[0]])">
    <slot />
</span>
</template>
