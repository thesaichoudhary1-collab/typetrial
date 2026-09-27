# TypeTrial

A lightweight, interactive typing speed test built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, no build step.

**Live demo:** https://thesaichoudhary1-collab.github.io/typetrial/

## What it does

TypeTrial shows a line of text and measures how fast and accurately you can type it. The timer starts automatically on your first keystroke, and every character you type is scored in real time: green for correct, red for incorrect, with a blinking caret marking your current position.

## Features

- **Live WPM and accuracy** — recalculated every 200ms as you type, not just at the end
- **Two modes** — a single-sentence "Quick line" stopwatch mode, and a 60-second countdown "Sprint" mode that strings sentences together into a longer passage
- **Per-character feedback** — instant color coding of correct/incorrect keystrokes as you type, including support for corrections via backspace
- **No page reload needed** — click "New line" to reset instantly with a new random sentence
- **Accessible input handling** — a real, focusable `<input>` element drives everything, styled invisibly under a custom-rendered text display
- **Responsive layout** with visible keyboard focus states and reduced-motion support

## Tech stack

- Plain HTML5, CSS3 (custom properties, flexbox), and vanilla JavaScript (no libraries)
- Google Fonts (Space Grotesk for UI, IBM Plex Mono for the typing text and stats)

## Project structure

    typetrial/
    ├── index.html      (markup)
    ├── style.css       (all styling, incl. color tokens as CSS variables)
    ├── script.js       (timer, scoring, and rendering logic)
    └── README.md

## Running it locally

No build step or server required — just open `index.html` in a browser.

## How the scoring works

- **WPM** is calculated as `(characters typed / 5) / minutes elapsed`, the standard convention for words-per-minute.
- **Accuracy** is `correct characters / total characters typed × 100`, recalculated live.
- **Sprint mode** ends automatically after 60 seconds; **Quick line mode** ends the instant you complete the sentence.

## License

MIT — free to use, modify, and build on.
