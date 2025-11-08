<script lang="ts">
    let { children, ...restProps } = $props();
</script>

<div
    class="m-auto bg-gray-200 dark:bg-gray-600 rounded-md p-4 shadow-md overflow-hidden {restProps.class ||
        ''}">
    {@render children?.()}
</div>
