# Work-with-Pomodoro

Simple Pomodoro timer web app.

## Description
This is a lightweight Pomodoro timer (work + break) implemented in plain HTML, CSS and JavaScript. It supports custom work and break durations, pause/resume, visual progress, notifications (if allowed) and an optional sound when a session completes.

## Files
- index.html — main page
- script.js — timer logic (comments translated to English)
- style.css — styling

## Usage
1. Open `index.html` in a browser.
2. Set the work and break durations using the inputs.
3. Click `Start` to begin the session. Use `Pause` and `Reset` as needed.
4. If you leave the page while a session is running, the state is saved and you will be prompted to resume on reload.

## Notes
- Browser must allow notifications for desktop notifications to appear.
- Sound uses the Web Audio API; it may require a user interaction in some browsers before playing.

## License
Copy or adapt as needed for personal projects.
