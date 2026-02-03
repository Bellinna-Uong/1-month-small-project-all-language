package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"time"
)

// App représente l'application
type App struct {
	ctx context.Context
}

// JournalEntry représente une entrée de journal
type JournalEntry struct {
	Date    string `json:"date"`    // Date de l'entrée (format YYYY-MM-DD)
	Content string `json:"content"` // Contenu de l'entrée
	Mood    string `json:"mood"`    // Humeur du jour (emoji ou texte)
}

// NewApp crée une nouvelle instance de l'application
func NewApp() *App {
	return &App{}
}

// startup est appelé au démarrage de l'application
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	
	// Créer le dossier de données s'il n'existe pas
	dataDir := a.getDataDir()
	os.MkdirAll(dataDir, 0755)
}

// getDataDir retourne le chemin du dossier de données
func (a *App) getDataDir() string {
	// Obtenir le dossier de configuration de l'utilisateur
	homeDir, err := os.UserHomeDir()
	if err != nil {
		homeDir = "."
	}
	return filepath.Join(homeDir, ".mon-journal")
}

// getFilePath retourne le chemin du fichier JSON contenant toutes les entrées
func (a *App) getFilePath() string {
	return filepath.Join(a.getDataDir(), "entries.json")
}

// SaveEntry sauvegarde une entrée de journal
func (a *App) SaveEntry(entry JournalEntry) error {
	// Charger toutes les entrées existantes
	entries, err := a.LoadAllEntries()
	if err != nil {
		entries = []JournalEntry{}
	}

	// Si la date existe déjà, mettre à jour l'entrée
	found := false
	for i, e := range entries {
		if e.Date == entry.Date {
			entries[i] = entry
			found = true
			break
		}
	}

	// Sinon, ajouter la nouvelle entrée
	if !found {
		entries = append(entries, entry)
	}

	// Sauvegarder dans le fichier JSON
	data, err := json.MarshalIndent(entries, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(a.getFilePath(), data, 0644)
}

// LoadAllEntries charge toutes les entrées du journal
func (a *App) LoadAllEntries() ([]JournalEntry, error) {
	filePath := a.getFilePath()

	// Vérifier si le fichier existe
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return []JournalEntry{}, nil
	}

	// Lire le fichier
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	// Désérialiser le JSON
	var entries []JournalEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		return nil, err
	}

	return entries, nil
}

// GetTodayEntry retourne l'entrée d'aujourd'hui si elle existe
func (a *App) GetTodayEntry() (*JournalEntry, error) {
	today := time.Now().Format("2006-01-02")
	
	entries, err := a.LoadAllEntries()
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry.Date == today {
			return &entry, nil
		}
	}

	return nil, nil
}

// GetEntryByDate retourne l'entrée pour une date donnée
func (a *App) GetEntryByDate(date string) (*JournalEntry, error) {
	entries, err := a.LoadAllEntries()
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry.Date == date {
			return &entry, nil
		}
	}

	return nil, nil
}
