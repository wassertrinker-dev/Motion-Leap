/**
 * Eine zentrale Liste, die die Konfigurationen für alle verfügbaren Level enthält.
 * Das Spiel wird diese Liste verwenden, um die Level dynamisch zu laden.
 */
export const levels = [
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
