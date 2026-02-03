import tkinter as tk
from tkinter import messagebox

# -------------------
# Game variables
# -------------------
current_player = "X"
board = [""] * 9

# -------------------
# Style (Y2K Pink Pixel)
# -------------------
BG_COLOR = "#ffd6e8"
BTN_COLOR = "#ff9ecf"
BTN_ACTIVE = "#ff6fb7"
X_COLOR = "#ff2fa4"
O_COLOR = "#8f5bff"
GRID_BORDER = "#ef7ec4"

FONT_PIXEL = ("Courier", 24, "bold") 
FONT_UI = ("Courier", 15, "bold")

# -------------------
# Game logic
# -------------------
def check_winner():
    """Check if there is a winner or a draw"""
    win_conditions = [
        (0,1,2), (3,4,5), (6,7,8),
        (0,3,6), (1,4,7), (2,5,8),
        (0,4,8), (2,4,6)
    ]

    for a, b, c in win_conditions:
        if board[a] == board[b] == board[c] != "":
            return board[a]

    if "" not in board:
        return "Draw"

    return None


def on_click(index):
    """Handle button click"""
    global current_player

    if board[index] != "":
        return

    board[index] = current_player
    buttons[index]["text"] = current_player

    if current_player == "X":
        buttons[index]["fg"] = X_COLOR
    else:
        buttons[index]["fg"] = O_COLOR

    result = check_winner()

    if result:
        if result == "Draw":
            messagebox.showinfo("Draw", "No winner this time 💿")
        else:
            messagebox.showinfo("Victory!", f"Player {result} wins ✨")

        reset_game()
    else:
        current_player = "O" if current_player == "X" else "X"


def reset_game():
    """Reset the board"""
    global board, current_player
    board = [""] * 9
    current_player = "X"

    for btn in buttons:
        btn.config(text="", fg="black")

# -------------------
# UI setup
# -------------------
window = tk.Tk()
window.title("Tic Tac Toe ✿ Y2K Edition")
window.configure(bg=BG_COLOR)
window.resizable(False, False)

buttons = []

for i in range(9):
    btn = tk.Button(
        window,
        text="",
        font=FONT_PIXEL,
        width=5,
        height=2,
        bg=BTN_COLOR,
        activebackground=BTN_ACTIVE,
        relief="ridge",
        bd=4,
        highlightbackground=GRID_BORDER,
        command=lambda i=i: on_click(i)
    )
    btn.grid(row=i // 3, column=i % 3, padx=4, pady=4)
    buttons.append(btn)

reset_btn = tk.Button(
    window,
    text="RESET ✧",
    font=FONT_UI,
    bg="#ffb3d9",
    activebackground=BTN_ACTIVE,
    relief="ridge",
    bd=3,
    command=reset_game
)
reset_btn.grid(row=3, column=0, columnspan=3, sticky="nsew", pady=8)

window.mainloop()
