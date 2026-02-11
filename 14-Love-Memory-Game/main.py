import tkinter as tk
from tkinter import messagebox
import random
import time

class MemoryGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Memory de la Saint-Valentin ❤️")
        self.root.configure(bg="#fff0f5") # Rose très pâle

        # Liste des emojis (doublés pour faire des paires)
        self.emojis = ['❤️', '🌹', '💍', '💌', '🐻', '🍫'] * 2
        random.shuffle(self.emojis)

        self.buttons = []
        self.first_card = None
        self.pairs_found = 0
        
        # Création de la grille (4 colonnes x 3 lignes)
        for i in range(12):
            btn = tk.Button(root, text="?", font=("Arial", 30), width=4, height=2,
                            bg="#ffb6c1", fg="white", relief="flat",
                            command=lambda i=i: self.card_clicked(i))
            btn.grid(row=i//4, column=i%4, padx=10, pady=10)
            self.buttons.append(btn)

    def card_clicked(self, index):
        # Si la carte est déjà révélée ou si on clique sur la même, on ne fait rien
        if self.buttons[index]["text"] != "?" or (self.first_card is not None and self.first_card == index):
            return

        # Révéler la carte
        self.buttons[index].config(text=self.emojis[index], bg="white", fg="black")
        self.root.update()

        if self.first_card is None:
            # C'est la première carte cliquée
            self.first_card = index
        else:
            # C'est la deuxième carte cliquée
            if self.emojis[self.first_card] == self.emojis[index]:
                # Paire trouvée !
                self.buttons[self.first_card].config(bg="#98fb98") # Vert tendre
                self.buttons[index].config(bg="#98fb98")
                self.pairs_found += 1
                self.first_card = None
                if self.pairs_found == 6:
                    messagebox.showinfo("Bravo !", "Tu as trouvé toutes les paires ! ✨💖")
            else:
                # Pas une paire, on attend un peu et on cache
                self.root.after(700, self.hide_cards, self.first_card, index)
                self.first_card = None

    def hide_cards(self, i1, i2):
        self.buttons[i1].config(text="?", bg="#ffb6c1", fg="white")
        self.buttons[i2].config(text="?", bg="#ffb6c1", fg="white")

if __name__ == "__main__":
    root = tk.Tk()
    game = MemoryGame(root)
    root.mainloop()