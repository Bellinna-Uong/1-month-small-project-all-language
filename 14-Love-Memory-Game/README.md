# ❤️ Valentine's Day Memory Game

A charming and minimalist memory matching game built with **Python** and the **Tkinter** library.

---

## 🌹 Overview
This project is a classic "Match-the-Pairs" game featuring a romantic Valentine's Day theme. It's designed to be simple, lightweight, and fun.

* **Theme:** Romantic aesthetics (Pastel pinks, heart and flower emojis).
* **Tech Stack:** Python 3 + Tkinter (GUI).
* **Features:** Randomized card shuffling, visual feedback on match, and a victory notification.

---

## 🎮 How to Play
1.  **Launch** the game.
2.  **Click** on a pink card (`?`) to reveal the hidden emoji.
3.  **Find the pair:** Click on a second card.
    * **Match:** The cards turn green and stay revealed.
    * **Mismatch:** The cards will flip back over after a short delay.
4.  **Win:** Find all **6 pairs** to complete the game!

---

## 🚀 Getting Started

### Prerequisites
* Python 3.x
* Tkinter (usually included with Python standard installations)

### Installation & Execution
1.  Clone this repository or download the source code.
2.  Navigate to the project folder.
3.  Run the script:
    ```bash
    python main.py
    ```

---

## 🛠️ Code Logic
* **Grid System:** Uses a $4 \times 3$ grid created dynamically with a loop.
* **State Management:** Tracks the first card clicked and compares it with the second.
* **Non-blocking Delay:** Uses `root.after()` to allow the user to see the second card before it flips back on a mismatch.

---

## 📈 Future Improvements
- [ ] Add a move counter to track score.
- [ ] Implement a timer for competitive play.
- [ ] Add a "Restart" button at the end of the game.
- [ ] Sound effects for matching and winning.
