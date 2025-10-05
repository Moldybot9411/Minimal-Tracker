CREATE TABLE trackers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    progress INTEGER NOT NULL,
    completed BOOLEAN NOT NULL CHECK (completed IN (0, 1)),
    completed_at INTEGER
);

CREATE TABLE daily_trackers (
    id INTEGER PRIMARY KEY,
    tracker_id INTEGER NOT NULL,
    last_completion INTEGER,
    FOREIGN KEY (tracker_id) REFERENCES trackers(id)
);