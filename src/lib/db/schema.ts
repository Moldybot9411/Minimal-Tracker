import { sqliteTable, integer, text, SQLiteBoolean, primaryKey } from 'drizzle-orm/sqlite-core'

export const trackers = sqliteTable("trackers", {
    id: integer().primaryKey(),
    name: text().notNull(),
    amount: integer().notNull(),
    progress: integer().notNull(),
    completed: integer({ mode: "boolean" }).notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" })
});

export const dailyTrackers = sqliteTable("daily_trackers", {
    id: integer(),
    trackerId: integer("tracker_id").notNull(),
    lastCompletion: integer("last_completion", { mode: "timestamp" })
})

export type SelectTracker = typeof trackers.$inferSelect;
export type InsertTracker = typeof trackers.$inferInsert;

export type SelectDailyTracker = typeof dailyTrackers.$inferSelect;
export type InsertDailyTracker = typeof dailyTrackers.$inferInsert;