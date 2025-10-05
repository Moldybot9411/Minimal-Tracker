<script lang="ts">
    import Check from "@lucide/svelte/icons/check";
    import Minus from "@lucide/svelte/icons/minus";
    import { BadgePlus, CalendarCheck, CircleCheck, Pickaxe, RotateCcw, Save, Settings, Trash2, Turntable } from "@lucide/svelte/icons/index";
    import Card from "$lib/Components/Card.svelte";
    import Dialog from "$lib/Components/Dialog.svelte";
    import { onMount } from "svelte";
    import { getAllTrackers, addTracker, updateProgress, completeTracker, deleteTracker, reopenTracker } from "$lib/appdata";
    import type { InsertTracker, SelectTracker } from "$lib/db/schema";
    import Button from "$lib/Components/Button.svelte";
    import Switch from "$lib/Components/Switch.svelte";

    let trackers: SelectTracker[] = $state([]);
    let new_tracker_name: string = $state("");
    let new_amount: number | undefined = $state();
    $effect(() => {
        if (new_amount != undefined) {
            new_amount = Math.abs(new_amount)
        }
    });

    let loading: boolean = $state(false);

    let newTrackerDialogVisible = $state(false);
    let settingsDialogVisible = $state(false);
    let discardDialogVisible = $state(false);

    let itemToDelete: SelectTracker | undefined = $state(undefined);

    onMount(async () => {
        refreshTrackers()
    });

    async function refreshTrackers() {
        loading = true;

        trackers = await getAllTrackers();

        loading = false;
    }

    async function add_tracker(name: string, amount: number | undefined) {
        if (!name) return;

        let new_tracker: InsertTracker = {
            id: undefined,
            name: name,
            amount: amount ?? 1,
            progress: 0,
            completed: false,
            completedAt: null
        };

        await addTracker(new_tracker)
        await refreshTrackers();

        new_tracker_name = "";
        new_amount = undefined;
    }

    function add_progress(tracker: SelectTracker) {
        if (tracker.progress < tracker.amount) {
            tracker.progress += 1

            updateProgress(tracker.id, tracker.progress)
        }

        if (tracker.progress == tracker.amount) {
            completeTracker(tracker.id);
            complete_tracker(tracker);
        }
    }

    function complete_tracker(tracker: SelectTracker) {
        tracker.completed = true;
        trackers = [...trackers]
    }

    function remove_progress(tracker: SelectTracker) {
        if (tracker.progress > 0) {
            tracker.progress -= 1
            updateProgress(tracker.id, tracker.progress)
        }
    }

    function delete_tracker(tracker: SelectTracker) {
        const index = trackers.indexOf(tracker, 0);
        if (index > -1) {
            trackers.splice(index, 1);
            trackers = [...trackers]
            deleteTracker(tracker.id);
        }
    }

    function reopen_tracker(tracker: SelectTracker) {
        tracker.progress = 0;
        tracker.completed = false;

        reopenTracker(tracker.id);

        trackers = [...trackers]
    }
</script>

<Card class="flex p-4 gap-2 rounded-t-none">
    <Button
        class="w-full"
        icon={BadgePlus}
        label="Add Tracker"
        onclick={() => newTrackerDialogVisible = true} />
    <Button
        variant="secondary"
        icon={Settings}
        onclick={() => settingsDialogVisible = true} />
</Card>

<Card
    class="flex flex-col mt-4 gap-2 p-4 text-xl font-bold {loading ? "animate-pulse" : ""}" >
    <div class="flex justify-center items-center gap-2 mb-2">
        <Pickaxe />
        <div>Todo</div>
    </div>
    {#each trackers.filter((x) => {return x.completed == false}) as tracker}
        <div class="flex items-center justify-between">
            <div class="wrap-anywhere">
                {tracker.name} {tracker.progress}/{tracker.amount}
            </div>
            <div class="flex gap-1">
                <Button
                    variant="accept"
                    onclick={() => add_progress(tracker)}
                    class="!p-1"
                    icon={Check} />
                <Button
                    variant="warning"
                    onclick={() => remove_progress(tracker)}
                    class="!p-1"
                    icon={Minus} />
                <Button
                    variant="danger"
                    onclick={() => {
                        itemToDelete = tracker;
                        discardDialogVisible = true;
                    }}
                    class="!p-1"
                    icon={Trash2} />
            </div>
        </div>
    {/each}
</Card>

<Card class="flex flex-col mt-4 gap-2 p-4 text-xl font-bold {loading ? "animate-pulse" : ""}">
    <div class="flex justify-center items-center gap-2 mb-2">
        <CalendarCheck />
        <span>Completed</span>
    </div>
    {#each trackers.filter((x) => {return x.completed == true}) as tracker}
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Check color="green"/>
                {tracker.name}
            </div>
            <div class="flex gap-1">
                <Button
                    class="!p-1"
                    onclick={() => reopen_tracker(tracker)}
                    variant="accept"
                    icon={RotateCcw} />
                <Button
                    class="!p-1"
                    onclick={() => {
                        itemToDelete = tracker;
                        discardDialogVisible = true;
                    }}
                    variant="danger"
                    icon={Trash2} />
            </div>
        </div>
    {/each}
</Card>

<Dialog
    label="New Tracker"
    bind:visible={newTrackerDialogVisible}
    bind:loading={loading} >
    <div class="p-2 flex flex-col gap-2">
        <div class="flex flex-col">
            <label for="newtracker" class="font-bold">Tracker Name</label>
            <input type="text" name="newtracker" id="newtracker" class="p-2 rounded-md bg-white" bind:value={new_tracker_name} placeholder="Drink water" >
        </div>

        <div class="flex flex-col">
            <label for="newamount" class="font-bold">Amount</label>
            <input type="number" name="newamount" id="newamount" min="1" class="p-2 rounded-md bg-white" bind:value={new_amount} placeholder=1 >
        </div>

        <Switch label="Make Tracker repeat daily" name="dailycheckbox" />

        <Button
            onclick={() => {
                loading = true;
                add_tracker(new_tracker_name, new_amount)
                    .then(() => {
                        newTrackerDialogVisible = false;
                    }
                );
            }}
            disabled={new_tracker_name || new_amount ? false : true}
            class="w-full"
            icon={BadgePlus}
            label="Add Tracker" />
    </div>
</Dialog>

<Dialog label="Settings" bind:visible={settingsDialogVisible}>

    <Switch
        class="font-bold"
        label="Autostart"
        name="autostart" />
    <Switch
        class="font-bold"
        label="Enable Reminder"
        name="reminder" />

    <Button
        class="w-full mt-2"
        icon={Save}
        label="Save & Quit" />
</Dialog>

<Dialog label="Delete Tracker" bind:visible={discardDialogVisible}>
    <div class="flex gap-2">
        <Button
            variant="secondary"
            class="w-full"
            label="Cancel"
            onclick={() => discardDialogVisible = false} />
        <Button
            class="w-full"
            label="Delete"
            icon={Trash2}
            onclick={() => {
                if (itemToDelete) {
                    delete_tracker(itemToDelete);
                }
                discardDialogVisible = false;
            }} />
    </div>
</Dialog>