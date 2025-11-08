<script lang="ts">
    import Card from "$lib/Components/Card.svelte";
    import TrackerList from "$lib/Components/TrackerList.svelte";
    import { deleteDialog } from "$lib/stores/deleteStore";
    import { trackers } from "$lib/trackerService";
    import { TimerReset } from "@lucide/svelte";
</script>

<Card class="flex flex-col gap-2 p-4 text-xl font-bold">
    <div class="flex justify-center items-center gap-2 mb-2">
        <TimerReset />
        <span>Completed Dailies</span>
    </div>
    <TrackerList
        trackers={$trackers.filter((x) => x.completed && x.isDaily)}
        variant="completed"
        ondelete={(id) => {
            deleteDialog.open(id);
        }} />
</Card>
