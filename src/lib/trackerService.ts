import {
    dbGetAllTrackers,
    dbAddTracker,
    dbUpdateTrackerProgress,
    dbCompleteTracker,
    dbDeleteTracker,
    dbReopenTracker,
} from "$lib/appdata";
import type { InsertTracker, SelectTracker } from "$lib/db/schema";

export const TrackerService = {
    async list(): Promise<SelectTracker[]> {
        return dbGetAllTrackers();
    },

    async add(name: string, amount?: number): Promise<void> {
        const tracker: InsertTracker = {
            id: undefined,
            name,
            amount: amount ?? 1,
            progress: 0,
            completed: false,
            completedAt: null,
        };

        await dbAddTracker(tracker);
    },

    async increment(tracker: SelectTracker): Promise<void> {
        const newProgress = Math.min(tracker.progress + 1, tracker.amount);
        await dbUpdateTrackerProgress(tracker.id, newProgress);
        if (newProgress === tracker.amount) await dbCompleteTracker(tracker.id);
    },

    async decrement(tracker: SelectTracker): Promise<void> {
        const newProgress = Math.max(tracker.progress - 1, 0);
        await dbUpdateTrackerProgress(tracker.id, newProgress);
    },

    async remove(id: number): Promise<void> {
        await dbDeleteTracker(id);
    },

    async reopen(id: number): Promise<void> {
        await dbReopenTracker(id);
    },
};
