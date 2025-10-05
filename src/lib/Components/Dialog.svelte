<script lang="ts">
    import type { Snippet } from "svelte";
    import Card from "./Card.svelte";
    import CircleX from "@lucide/svelte/icons/circle-x";

    interface Props {
        label?: string;
        visible?: boolean;
        loading?: boolean;
        children: Snippet;
    }

    let { label, visible = $bindable(true), loading = $bindable(false), children }: Props = $props();
</script>

<div
    class="fixed top-0 left-0 w-full h-[100vh] z-99 backdrop-blur-sm flex"
    class:hidden={!visible}
    class:animate-pulse={loading} >
    <Card class="!p-0">
        <div class="flex items-center justify-between p-2 bg-gray-300">
            <span class="text-xl font-bold">{label}</span>
            <button class="hover:bg-gray-400 rounded-md p-2" onclick={() => visible = false}><CircleX size="1.25rem"/></button>
        </div>
        <hr>
        <div class="p-4">
            {@render children?.()}
        </div>
    </Card>
</div>