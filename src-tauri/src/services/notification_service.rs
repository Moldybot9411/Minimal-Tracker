use chrono::Timelike;
use tauri_plugin_notification::NotificationExt;
use std::time::Duration;
use tokio::time::sleep;

pub async fn start_notifications(app: tauri::AppHandle) {
    tokio::spawn(async move {
        loop {
            let now = chrono::Local::now();
            let next_hour = (now + chrono::Duration::hours(1))
                .with_minute(0).unwrap()
                .with_second(0).unwrap()
                .with_nanosecond(0).unwrap();

            let dur: Duration = (next_hour - now).to_std().unwrap();
            sleep(dur).await;

            app.notification()
                .builder()
                .title("Reminder")
                .body("You still have tasks to do!")
                .show()
                .unwrap();
        }
    });
}
