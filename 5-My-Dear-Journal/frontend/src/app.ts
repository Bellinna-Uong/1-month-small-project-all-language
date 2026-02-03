/*
 * DÉCLARATIONS TYPESCRIPT
 * Ces interfaces décrivent la structure des données que notre application utilise.
 * TypeScript nous aide à éviter les erreurs en vérifiant les types de données.
 */

// Interface pour une entrée de journal
// Chaque entrée contient 3 informations : date, texte et humeur
interface JournalEntry {
    date: string;    // Format YYYY-MM-DD (ex: "2026-02-03")
    content: string; // Le texte que l'utilisateur a écrit
    mood: string;    // L'emoji choisi (ex: "😊")
}

// Interface pour les fonctions exposées par le backend Go
// Wails crée automatiquement window.go.main.App pour nous permettre d'appeler
// les fonctions Go depuis JavaScript/TypeScript
declare global {
    interface Window {
        go: {
            main: {
                App: {
                    // Sauvegarde une entrée (retourne une Promise qui ne renvoie rien)
                    SaveEntry(entry: JournalEntry): Promise<void>;
                    // Charge toutes les entrées (retourne une Promise avec un tableau)
                    LoadAllEntries(): Promise<JournalEntry[]>;
                    // Récupère l'entrée d'aujourd'hui (peut être null si pas d'entrée)
                    GetTodayEntry(): Promise<JournalEntry | null>;
                    // Récupère l'entrée d'une date spécifique
                    GetEntryByDate(date: string): Promise<JournalEntry | null>;
                };
            };
        };
    }
}

/*
 * VARIABLES GLOBALES
 * Ces variables sont accessibles partout dans le fichier et persistent
 * pendant toute la durée de vie de l'application.
 */

// L'humeur actuellement sélectionnée par l'utilisateur
// Par défaut, c'est l'emoji souriant
let currentMood: string = '😊';

// La date d'aujourd'hui au format YYYY-MM-DD
// Cette variable est remplie au démarrage de l'application
let currentDate: string = '';

/*
 * FONCTIONS UTILITAIRES
 * Ces fonctions aident à formater et manipuler les dates.
 */

/**
 * Convertit un objet Date JavaScript en texte français lisible
 * 
 * Exemple : new Date(2026, 1, 3) → "Lundi 3 février 2026"
 * 
 * @param date - L'objet Date à formater
 * @returns Une chaîne de caractères au format "Jour DD mois AAAA"
 */
function formatDate(date: Date): string {
    // Tableaux pour traduire les noms en français
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    // Extraire les composantes de la date
    // getDay() retourne 0-6 (0 = Dimanche, 1 = Lundi, etc.)
    const dayName = days[date.getDay()];
    // getDate() retourne le jour du mois (1-31)
    const day = date.getDate();
    // getMonth() retourne 0-11 (0 = janvier, 1 = février, etc.)
    const month = months[date.getMonth()];
    // getFullYear() retourne l'année complète (ex: 2026)
    const year = date.getFullYear();
    
    // Assembler les parties avec des template strings (backticks)
    return `${dayName} ${day} ${month} ${year}`;
}

/**
 * Convertit un objet Date en format ISO (YYYY-MM-DD)
 * Ce format est standardisé et facile à comparer/trier
 * 
 * Exemple : new Date(2026, 1, 3) → "2026-02-03"
 * 
 * @param date - L'objet Date à convertir
 * @returns Une chaîne au format YYYY-MM-DD
 */
function getDateString(date: Date): string {
    const year = date.getFullYear();
    // getMonth() retourne 0-11, donc on ajoute 1
    // padStart(2, '0') ajoute un 0 devant si nécessaire (ex: "3" → "03")
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // Assembler avec des tirets
    return `${year}-${month}-${day}`;
}

/**
 * Affiche un message temporaire à l'utilisateur
 * Le message apparaît pendant 3 secondes puis disparaît
 * 
 * @param text - Le texte à afficher
 * @param type - Le type de message ('success' en vert, 'error' en rouge)
 */
function showMessage(text: string, type: 'success' | 'error'): void {
    // Récupérer l'élément HTML qui affiche les messages
    const messageEl = document.getElementById('message');
    if (!messageEl) return; // Si l'élément n'existe pas, on arrête
    
    // Mettre le texte dans l'élément
    messageEl.textContent = text;
    // Définir les classes CSS pour le style
    // 'show' rend le message visible (opacity: 1)
    messageEl.className = `message ${type} show`;
    
    // Après 3 secondes (3000 millisecondes), enlever la classe 'show'
    // Cela fait disparaître le message en douceur grâce à la transition CSS
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

/*
 * FONCTIONS PRINCIPALES
 * Ces fonctions gèrent les interactions principales de l'application.
 */

/**
 * Sauvegarde l'entrée de journal actuelle
 * Cette fonction est appelée quand l'utilisateur clique sur "Sauvegarder"
 * 
 * Processus :
 * 1. Récupère le texte de la zone de texte
 * 2. Vérifie que ce n'est pas vide
 * 3. Crée un objet JournalEntry
 * 4. Appelle la fonction Go pour sauvegarder
 * 5. Affiche un message de confirmation
 */
async function saveEntry(): Promise<void> {
    // Récupérer l'élément textarea du HTML
    const textArea = document.getElementById('journalText') as HTMLTextAreaElement;
    // Récupérer le contenu du textarea (ou chaîne vide si null)
    const content = textArea?.value || '';
    
    // Vérifier que l'utilisateur a écrit quelque chose
    // trim() enlève les espaces au début et à la fin
    if (!content.trim()) {
        // Afficher un message d'erreur si vide
        showMessage('Écris quelque chose avant de sauvegarder ! ✎', 'error');
        return; // Arrêter la fonction ici
    }
    
    // Créer un objet contenant toutes les informations de l'entrée
    const entry: JournalEntry = {
        date: currentDate,      // La date d'aujourd'hui
        content: content,       // Le texte écrit
        mood: currentMood       // L'humeur sélectionnée
    };
    
    // Bloc try-catch pour gérer les erreurs potentielles
    try {
        // Appeler la fonction Go SaveEntry
        // 'await' attend que la sauvegarde soit terminée
        // window.go.main.App est créé automatiquement par Wails
        await window.go.main.App.SaveEntry(entry);
        // Si tout s'est bien passé, afficher un message de succès
        showMessage('Entrée sauvegardée avec succès ! ♡', 'success');
    } catch (error) {
        // Si une erreur s'est produite, l'afficher dans la console
        console.error('Erreur lors de la sauvegarde:', error);
        // Et informer l'utilisateur
        showMessage('Erreur lors de la sauvegarde :(', 'error');
    }
}

/**
 * Charge l'entrée d'aujourd'hui depuis le fichier de sauvegarde
 * Si une entrée existe pour aujourd'hui, elle remplit la zone de texte
 * 
 * Cette fonction est appelée au démarrage de l'application
 */
async function loadTodayEntry(): Promise<void> {
    try {
        // Appeler la fonction Go pour récupérer l'entrée d'aujourd'hui
        // Peut retourner null si aucune entrée n'existe pour aujourd'hui
        const entry = await window.go.main.App.GetTodayEntry();
        
        // Vérifier si une entrée existe
        if (entry) {
            // Récupérer l'élément textarea
            const textArea = document.getElementById('journalText') as HTMLTextAreaElement;
            if (textArea) {
                // Remplir la zone de texte avec le contenu sauvegardé
                textArea.value = entry.content;
                // Mettre à jour le compteur de caractères
                updateCharCount();
            }
            
            // Mettre à jour l'humeur sélectionnée
            currentMood = entry.mood;
            // Mettre à jour visuellement quel bouton d'humeur est sélectionné
            updateMoodSelection();
        }
        // Si entry est null, on ne fait rien (zone de texte vide)
    } catch (error) {
        // En cas d'erreur, l'afficher dans la console
        console.error('Erreur lors du chargement:', error);
        // On ne bloque pas l'application, l'utilisateur peut quand même écrire
    }
}

/**
 * Met à jour visuellement le bouton d'humeur sélectionné
 */
function updateMoodSelection(): void {
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        const btnElement = btn as HTMLButtonElement;
        if (btnElement.dataset.mood === currentMood) {
            btnElement.classList.add('selected');
        } else {
            btnElement.classList.remove('selected');
        }
    });
}

/**
 * Met à jour le compteur de caractères affichés
 */
function updateCharCount(): void {
    const textArea = document.getElementById('journalText') as HTMLTextAreaElement;
    const charCount = document.getElementById('charCount');
    
    if (textArea && charCount) {
        charCount.textContent = String(textArea.value.length);
    }
}

/**
 * Affiche le panel d'historique avec toutes les entrées passées
 */
async function showHistory(): Promise<void> {
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    
    if (!historyPanel || !historyList) return;
    
    try {
        const entries = await window.go.main.App.LoadAllEntries();
        
        // Trier par date décroissante (plus récent en premier)
        entries.sort((a: JournalEntry, b: JournalEntry) => b.date.localeCompare(a.date));
        
        historyList.innerHTML = '';
        
        if (entries.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #ff69b4;">Aucune entrée pour le moment... Commence à écrire ! ✿</p>';
        } else {
            entries.forEach((entry: JournalEntry) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'history-entry';
                
                const date = new Date(entry.date + 'T00:00:00');
                const formattedDate = formatDate(date);
                
                entryDiv.innerHTML = `
                    <div class="history-entry-header">
                        <span class="history-entry-date">${formattedDate}</span>
                        <span class="history-entry-mood">${entry.mood}</span>
                    </div>
                    <div class="history-entry-content">${entry.content}</div>
                `;
                
                historyList.appendChild(entryDiv);
            });
        }
        
        historyPanel.classList.add('show');
    } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        showMessage('Erreur lors du chargement de l\'historique :(', 'error');
    }
}

/**
 * Ferme le panel d'historique
 */
function closeHistory(): void {
    const historyPanel = document.getElementById('historyPanel');
    if (historyPanel) {
        historyPanel.classList.remove('show');
    }
}

/**
 * Initialisation de l'application
 * Cette fonction est appelée au chargement de la page
 */
function init(): void {
    // Définir la date courante
    const today = new Date();
    currentDate = getDateString(today);
    
    // Afficher la date
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        dateDisplay.textContent = formatDate(today);
    }
    
    // Charger l'entrée d'aujourd'hui si elle existe
    loadTodayEntry();
    
    // Événements pour les boutons d'humeur
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnElement = btn as HTMLButtonElement;
            currentMood = btnElement.dataset.mood || '😊';
            updateMoodSelection();
        });
    });
    
    // Événement pour le bouton de sauvegarde
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveEntry);
    }
    
    // Événement pour le bouton d'historique
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', showHistory);
    }
    
    // Événement pour fermer l'historique
    const closeBtn = document.getElementById('closeHistory');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeHistory);
    }
    
    // Événement pour le compteur de caractères
    const textArea = document.getElementById('journalText') as HTMLTextAreaElement;
    if (textArea) {
        textArea.addEventListener('input', updateCharCount);
    }
    
    // Initialiser le compteur de caractères
    updateCharCount();
    
    // Initialiser la sélection de l'humeur
    updateMoodSelection();
}

// Démarrer l'application quand le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export vide pour faire de ce fichier un module ES6
// Cela permet d'utiliser 'declare global' pour étendre l'interface Window
export {};