<script lang="ts">
    import {
        BadgePlus,
        CalendarCheck,
        Pickaxe,
        TimerReset,
    } from "@lucide/svelte/icons/index";
    import Card from "$lib/Components/Card.svelte";
    import { trackers } from "$lib/trackerService";
    import Button from "$lib/Components/Button.svelte";
    import { Settings2Icon } from "@lucide/svelte";
    import TrackerList from "$lib/Components/TrackerList.svelte";
    import { deleteDialog } from "$lib/stores/deleteStore";
</script>

<Card class="flex flex-col gap-2 p-4 text-xl font-bold">
    <div class="flex justify-center items-center gap-2 mb-2">
        <Pickaxe />
        <div>Todo</div>
    </div>
    <TrackerList
        trackers={$trackers.filter((x) => x.completed === false)}
        ondelete={(id) => {
            deleteDialog.open(id);
        }} />
</Card>
