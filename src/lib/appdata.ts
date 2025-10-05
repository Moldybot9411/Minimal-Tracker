import { db } from '$lib/db/database';
import * as schema from '$lib/db/schema'
import { eq } from 'drizzle-orm/sqlite-core/expressions';

export async function getAllTrackers(): Promise<schema.SelectTracker[]> {
    let trackers: schema.SelectTracker[] = [];

    await db.query.trackers
        .findMany()
        .execute()
        .then((results) => {
            trackers = results
        });

    return trackers;
}

export async function addTracker(tracker: schema.InsertTracker) {
    await db.insert(schema.trackers)
        .values(tracker);
}

export async function updateProgress(id: number, progress: number) {
    await db.update(schema.trackers)
        .set({ progress: progress })
        .where(eq(schema.trackers.id, id));
}

export async function completeTracker(id: number) {
    await db.update(schema.trackers)
        .set({ completed: true })
        .where(eq(schema.trackers.id, id))
}

export async function reopenTracker(id: number) {
    await db.update(schema.trackers)
        .set({ completed: false, progress: 0 })
        .where(eq(schema.trackers.id, id));
}

export async function deleteTracker(id: number) {
    await db.delete(schema.trackers)
        .where(eq(schema.trackers.id, id))
}