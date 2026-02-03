package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Créer une instance de l'application
	app := NewApp()

	// Configuration de l'application avec une petite fenêtre
	err := wails.Run(&options.App{
		Title:  "Mon Journal ♡",
		Width:  500,  // Largeur de la fenêtre (petit format)
		Height: 650,  // Hauteur de la fenêtre
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 240, B: 245, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
