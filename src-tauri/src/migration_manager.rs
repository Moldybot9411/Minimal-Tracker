use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<tauri_plugin_sql::Migration> {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: include_str!("./migrations/01_initial.sql"),
        kind: MigrationKind::Up,
    }];

    migrations
}
