# 🏎️ AUTO_OS // TELEMETRY TERMINAL

**AUTO_OS** is a cinematic, high-tech, browser-based operating system interface themed around automotive telemetry, street racing, and ECU tuning. Built purely with Vanilla HTML, CSS, and JavaScript, it features a fully interactive desktop environment, draggable window management, mini-games, and cutting-edge cyberpunk visual effects.

---

## ⚡ Features

### 🖥️ Desktop Environment
*   **Cinematic Boot Sequence:** Faux ECU flashing sequence with an animated RPM gauge and RGB-split glitch text.
*   **Draggable App Windows:** Fully interactive window management with global Z-index tracking (click to bring to front).
*   **Smart Iframe Dragging:** Custom logic prevents the cursor from getting stuck when dragging windows over Google Maps or Spotify iframes.
*   **Tactical Drone Cursor:** A custom trailing cursor with rotating crosshairs that transitions into a red "lock-on" state when hovering over interactive elements.

### 🎛️ Built-in Applications
*   **Engine Control:** Sliders and toggles for Boost Target, Traction Control, Launch Control, and Active Exhaust.
*   **Telemetry Monitor:** Live mockup data of RPM, Boost, Oil Temp, and Intake Temp.
*   **Nav System:** Embedded Google Maps tracking interface.
*   **Media Deck:** Embedded Spotify player with a simulated FM/AM radio frequency scanner.
*   **TTY Console:** A working mock command-line interface (try commands like `boost`, `clear`, or `help`).
*   **Calendar & Garage:** File system mockups and a functioning session-based reminder tool.

### 🕹️ Arcade Strip (Side Drawer)
A hidden panel on the right side containing automotive-themed mini-games:
*   **Turbo Clicker:** Mash the throttle to build RPM and PSI within a 15-second time limit. Tracks local high scores.
*   **Launch Reaction Test:** Wait for the green light to test your off-the-line reaction time.
*   **Snap Shift:** A timing mini-game to test your redline shifting accuracy.

### 🌌 Visual Effects
*   **3D Synthwave Grid:** A pure CSS perspective-transformed grid that continuously scrolls toward the user, fading into a neon horizon.
*   **Glassmorphism UI:** Deep background blurs, glowing borders, and semi-transparent window panels.
*   **CRT Overlay:** Subtle scanlines and edge vignette for that authentic heavy-duty terminal feel.
*   **Breathing Animations:** Pulsing glows on the central chronometer and ignition buttons.

---

## 🛠️ Tech Stack

*   **HTML5:** Semantic structure and layout.
*   **CSS3:** Advanced animations (`@keyframes`), CSS variables, 3D transforms, glassmorphism filters, and flexbox/grid layouts.
*   **JavaScript (ES6):** Vanilla JS for state management, DOM manipulation, cursor tracking, window dragging, and local storage (for high scores). No external libraries or frameworks.

---

## 🚀 How to Run

1. Clone or download this repository.
2. Ensure all three core files are in the same directory:
   *   `index.html`
   *   `style.css`
   *   `script.js`
3. Double-click `index.html` to open it in any modern web browser. 

*Note: The Spotify and Google Maps embeds require an active internet connection to load.*

---

## 📂 File Structure

```text
AUTO_OS/
│
├── index.html    # Core structure, SVG icons, and window templates
├── style.css     # 3D grid, animations, glass UI, and custom cursor styling
└── script.js     # Window dragging logic, boot sequence, apps, and mini-games