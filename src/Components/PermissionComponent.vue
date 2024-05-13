<script>
export default {
    name: 'PermissionComponent',
}
</script>

<template>
<t v-if="Gate.allows('permission', this.$attrs)">
    <slot />
</t>
</template>
