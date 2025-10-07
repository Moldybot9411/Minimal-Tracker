<script lang="ts">
    import Check from "@lucide/svelte/icons/check";
    import Minus from "@lucide/svelte/icons/minus";
    import { BadgePlus, CalendarCheck, CircleCheck, Pickaxe, RotateCcw, Save, Settings, Trash2, Turntable } from "@lucide/svelte/icons/index";
    import Card from "$lib/Components/Card.svelte";
    import Dialog from "$lib/Components/Dialog.svelte";
    import { onMount } from "svelte";
    import { TrackerService } from "$lib/trackerService";
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

    let activeDialog: 'new' | 'settings' | 'discard' | null = $state(null);

    let itemToDelete: SelectTracker | undefined = $state(undefined);

    onMount(async () => {
        refreshTrackers()
    });

    async function refreshTrackers() {
        loading = true;

        trackers = await TrackerService.list();

        loading = false;
    }

    async function createTracker(name: string, amount?: number) {
        if (!name.trim()) return;

        TrackerService.add(name, amount);

        await refreshTrackers();

        new_tracker_name = "";
        new_amount = undefined;
    }

    function incrementTracker(tracker: SelectTracker) {
        tracker.progress += 1;
        TrackerService.increment(tracker);
    }

    function decrementTracker(tracker: SelectTracker) {
        tracker.progress -= 1;
        TrackerService.decrement(tracker);
    }

    function removeTracker(tracker: SelectTracker) {
        const index = trackers.indexOf(tracker, 0);
        if (index > -1) {
            trackers = trackers.filter(t => t.id !== tracker.id);
            TrackerService.remove(tracker.id);
        }
    }

    function reopenTracker(tracker: SelectTracker) {
        tracker.progress = 0;
        tracker.completed = false;

        TrackerService.reopen(tracker.id);

        trackers = [...trackers]
    }
</script>

<Card class="flex p-4 gap-2 rounded-t-none">
    <Button
        class="w-full"
        icon={BadgePlus}
        label="Add Tracker"
        onclick={() => activeDialog = "new"} />
    <Button
        variant="secondary"
        icon={Settings}
        onclick={() => activeDialog = "settings"} />
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
                    onclick={() => incrementTracker(tracker)}
                    class="!p-1"
                    icon={Check} />
                <Button
                    variant="warning"
                    onclick={() => decrementTracker(tracker)}
                    class="!p-1"
                    icon={Minus} />
                <Button
                    variant="danger"
                    onclick={() => {
                        itemToDelete = tracker;
                        activeDialog = "discard";
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
                    onclick={() => reopenTracker(tracker)}
                    variant="accept"
                    icon={RotateCcw} />
                <Button
                    class="!p-1"
                    onclick={() => {
                        itemToDelete = tracker;
                        activeDialog = "discard";
                    }}
                    variant="danger"
                    icon={Trash2} />
            </div>
        </div>
    {/each}
</Card>

<Dialog
    label="New Tracker"
    visible={activeDialog === "new"}
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
                createTracker(new_tracker_name, new_amount)
                    .then(() => {
                        activeDialog = null;
                    }
                );
            }}
            disabled={new_tracker_name || new_amount ? false : true}
            class="w-full"
            icon={BadgePlus}
            label="Add Tracker" />
    </div>
</Dialog>

<Dialog label="Settings" visible={activeDialog === "settings"}>

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

<Dialog label="Delete Tracker" visible={activeDialog === "discard"}>
    <div class="flex gap-2">
        <Button
            variant="secondary"
            class="w-full"
            label="Cancel"
            onclick={() => activeDialog = null} />
        <Button
            class="w-full"
            label="Delete"
            icon={Trash2}
            onclick={() => {
                if (itemToDelete) {
                    removeTracker(itemToDelete);
                }
                activeDialog = null;
            }} />
    </div>
</Dialog>