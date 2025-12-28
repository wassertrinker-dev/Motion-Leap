/**
 * Definiert die Struktur für das Verhalten von Gegnern in einem bestimmten Level.
 */
export interface EnemyBehavior {
    /** Die Basisgeschwindigkeit der Gegner. */
    baseSpeed: number;
    /**
     * Ein Wert, der die Zufälligkeit der Geschwindigkeit beeinflusst.
     * 0 bedeutet konstante Geschwindigkeit, ein höherer Wert bedeutet mehr Varianz.
     */
    speedVariance: number;
}

/**
 * Definiert die Struktur für die Konfiguration eines einzelnen Levels.
 */
export interface Level {
    /** Die eindeutige Nummer des Levels. */
    levelNumber: number;
    /** Die Dauer des Levels in Sekunden. */
    duration: number;
    /** Das Intervall in Millisekunden, in dem neue Gegner erzeugt werden. */
    enemyInterval: number;
    /** Die Konfiguration des Gegnerverhaltens für dieses Level. */
    enemyBehavior: EnemyBehavior;
}

/**
 * Eine zentrale Liste, die die Konfigurationen für alle verfügbaren Level enthält.
 * Das Spiel wird diese Liste verwenden, um die Level dynamisch zu laden.
 */
export const levels: Level[] = [
    {
        levelNumber: 1,
        duration: 60,
        enemyInterval: 2000,
        enemyBehavior: {
            baseSpeed: 5,
            speedVariance: 0, // Konstante Geschwindigkeit
        }
    },
    {
        levelNumber: 2,
        duration: 60,
        enemyInterval: 1500, // Schnellere Gegnererzeugung
        enemyBehavior: {
            baseSpeed: 10,
            speedVariance: 2, // Leichte Geschwindigkeitsvarianz
        }
    }
];
