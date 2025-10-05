<script lang="ts">
    let { children, ...restProps} = $props();
</script>

<div class="max-w-[30rem] m-auto bg-gray-200 rounded-md p-4 shadow-md overflow-hidden {restProps.class || ""}">
    {@render children?.()}
</div>