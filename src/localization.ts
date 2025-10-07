// In src/localization.ts

/**
 * Definiert die unterstützten Sprachkürzel.
 * 'en' = Englisch, 'de' = Deutsch, 'fr' = Französisch, 'it' = Italienisch, 'es' = Spanisch
 */
export type Language = 'en' | 'de' | 'fr' | 'it' | 'es';

// Ein Objekt, das alle übersetzten Texte für die unterstützten Sprachen enthält.
const translations = {
    // Deutsch
    de: {
        // Buttons
        startButton: "Spiel starten",
        restartButton: "Neustart",
        nextLevelButton: "Nächstes Level",
        // In-Game UI
        winMessage: "Gut gemacht!",
        finalScore: (score: number) => `Punkte: ${score}`,
        timeLabel: (minutes: number, seconds: string) => `Zeit: ${minutes}:${seconds}`,
        ingameScore: (score: number) => `Score: ${score}`,
        // Ladebildschirm
        loadingTitle: "Modelle werden geladen, KI wird initialisiert...",
        starting: "Starte...",
        initCamera: "Kamera wird initialisiert...",
        cameraReady: "Kamera ist bereit.",
        loadingModel: (p: number) => `Lade KI-Modell (${p}%)...`,
        modelReady: "Modell wird vorbereitet...",
        gameStarts: "Spiel startet!",
        // Themenauswahl
        themeSelectionTitle: "Wähle deinen Stil:",
        themeNameFairyTale: "Märchen",
        themeNameNinja: "Ninja",
        altFairyTale: "Märchenheldin",
        altNinja: "Ninjaheld",
        // Sonstiges
        pageTitle: "Camera Jump 'n' Run",
        debugLogTitle: "Debug Log",
        noCamera: "Ohne Kamerazugriff kann das Spiel nicht gestartet werden.",
    },
    // Englisch
    en: {
        // Buttons
        startButton: "Start Game",
        restartButton: "Restart",
        nextLevelButton: "Next Level",
        // In-Game UI
        winMessage: "Well Done!",
        finalScore: (score: number) => `Score: ${score}`,
        timeLabel: (minutes: number, seconds: string) => `Time: ${minutes}:${seconds}`,
        ingameScore: (score: number) => `Score: ${score}`,
        // Ladebildschirm
        loadingTitle: "Loading models, initializing AI...",
        starting: "Starting...",
        initCamera: "Initializing camera...",
        cameraReady: "Camera ready.",
        loadingModel: (p: number) => `Loading AI model (${p}%)...`,
        modelReady: "Preparing model...",
        gameStarts: "Game starts!",
        // Themenauswahl
        themeSelectionTitle: "Choose your style:",
        themeNameFairyTale: "Fairy Tale",
        themeNameNinja: "Ninja",
        altFairyTale: "Fairy tale hero",
        altNinja: "Ninja hero",
        // Sonstiges
        pageTitle: "Camera Jump 'n' Run",
        debugLogTitle: "Debug Log",
        noCamera: "The game cannot start without camera access.",
    },
    // Französisch
    fr: {
        // Buttons
        startButton: "Commencer",
        restartButton: "Recommencer",
        nextLevelButton: "Niveau suivant",
        // In-Game UI
        winMessage: "Bien joué !",
        finalScore: (score: number) => `Score : ${score}`,
        timeLabel: (minutes: number, seconds: string) => `Temps : ${minutes}:${seconds}`,
        ingameScore: (score: number) => `Score : ${score}`,
        // Ladebildschirm
        loadingTitle: "Chargement des modèles, initialisation de l'IA...",
        starting: "Démarrage...",
        initCamera: "Initialisation de la caméra...",
        cameraReady: "Caméra prête.",
        loadingModel: (p: number) => `Chargement du modèle IA (${p}%)...`,
        modelReady: "Préparation du modèle...",
        gameStarts: "Le jeu commence !",
        // Themenauswahl
        themeSelectionTitle: "Choisis ton style :",
        themeNameFairyTale: "Conte de fées",
        themeNameNinja: "Ninja",
        altFairyTale: "Héroïne de conte de fées",
        altNinja: "Héros ninja",
        // Sonstiges
        pageTitle: "Camera Jump 'n' Run",
        debugLogTitle: "Log de débogage",
        noCamera: "Le jeu ne peut pas démarrer sans accès à la caméra.",
    },
    // Italienisch
    it: {
        // Buttons
        startButton: "Inizia",
        restartButton: "Ricomincia",
        nextLevelButton: "Livello successivo",
        // In-Game UI
        winMessage: "Ben fatto!",
        finalScore: (score: number) => `Punteggio: ${score}`,
        timeLabel: (minutes: number, seconds: string) => `Tempo: ${minutes}:${seconds}`,
        ingameScore: (score: number) => `Score: ${score}`,
        // Ladebildschirm
        loadingTitle: "Caricamento modelli, inizializzazione AI...",
        starting: "Inizio...",
        initCamera: "Inizializzazione della fotocamera...",
        cameraReady: "Fotocamera pronta.",
        loadingModel: (p: number) => `Caricamento del modello AI (${p}%)...`,
        modelReady: "Preparazione del modello...",
        gameStarts: "Il gioco inizia!",
        // Themenauswahl
        themeSelectionTitle: "Scegli il tuo stile:",
        themeNameFairyTale: "Fiaba",
        themeNameNinja: "Ninja",
        altFairyTale: "Eroina delle fiabe",
        altNinja: "Eroe ninja",
        // Sonstiges
        pageTitle: "Camera Jump 'n' Run",
        debugLogTitle: "Log di debug",
        noCamera: "Il gioco non può iniziare senza accesso alla telecamera.",
    },
    // Spanisch
    es: {
        // Buttons
        startButton: "Empezar",
        restartButton: "Reiniciar",
        nextLevelButton: "Siguiente nivel",
        // In-Game UI
        winMessage: "¡Bien hecho!",
        finalScore: (score: number) => `Puntuación: ${score}`,
        timeLabel: (minutes: number, seconds: string) => `Tiempo: ${minutes}:${seconds}`,
        ingameScore: (score: number) => `Score: ${score}`,
        // Ladebildschirm
        loadingTitle: "Cargando modelos, inicializando IA...",
        starting: "Iniciando...",
        initCamera: "Inicializando cámara...",
        cameraReady: "Cámara lista.",
        loadingModel: (p: number) => `Cargando modelo de IA (${p}%)...`,
        modelReady: "Preparando modelo...",
        gameStarts: "¡El juego comienza!",
        // Themenauswahl
        themeSelectionTitle: "Elige tu estilo:",
        themeNameFairyTale: "Cuento de hadas",
        themeNameNinja: "Ninja",
        altFairyTale: "Heroína de cuento de hadas",
        altNinja: "Héroe ninja",
        // Sonstiges
        pageTitle: "Camera Jump 'n' Run",
        debugLogTitle: "Registro de depuración",
        noCamera: "El juego no puede iniciarse sin acceso a la cámara.",
    }
};

/**
 * Ermittelt die vom Benutzer gewünschte Sprache aus dem URL-Parameter 'lang'.
 * @returns {Language} Die ausgewählte Sprache, standardmäßig 'en'.
 */
function getLanguage(): Language {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && Object.keys(translations).includes(langParam)) {
        return langParam as Language;
    }
    return 'en'; // Englisch als Standardsprache
}

// Exportiert das richtige Sprachpaket basierend auf der URL.
export const text = translations[getLanguage()];
