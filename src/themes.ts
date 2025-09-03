// in /src/themes.ts

/**
 * Definiert die Struktur für die Animations-Assets einer Spielfigur.
 * Jedes Thema muss für 'idle', 'jump' und 'fall' ein Asset bereitstellen.
 */
export interface AnimationAssets {
    /** Die Animation für den Zustand am Boden (stehend). */
    idle: { src: string; frameCount: number };
    /** Die Animation für die Aufwärtsbewegung des Sprungs. */
    jump: { src: string; frameCount: number };
    /** Die Animation für die Abwärtsbewegung (Fallen). */
    fall: { src: string; frameCount: number };
}

/**
 * Definiert die Struktur für ein komplettes visuelles Thema im Spiel.
 */
export interface GameTheme {
    /** Ein Objekt, das alle Spieler-Animationen für dieses Thema enthält. */
    playerAnimations: AnimationAssets;
    /** Der Pfad zur Bilddatei für die Gegner in diesem Thema. */
    enemyImageSrc: string;
    /** Die Hintergrundfarbe für den Startbildschirm dieses Themas. */
    backgroundColor: string;
}

/**
 * Eine Bibliothek, die alle verfügbaren Spiel-Themen enthält.
 * Der Schlüssel (z.B. 'maerchen') muss mit dem `data-theme`-Attribut im HTML übereinstimmen.
 * 
 * Um ein neues Thema hinzuzufügen:
 * 1. Erstelle einen neuen Eintrag hier (z.B. 'weltraum': { ... }).
 * 2. Füge die benötigten Bilddateien zum `/dist/assets`-Ordner hinzu.
 * 3. Erstelle eine neue Themen-Auswahlkarte in der `index.html`.
 */
export const themes: { [key: string]: GameTheme } = {
    'maerchen': {
        playerAnimations: {
            // Benutzt das erste Frame des Sprung-Sheets als statisches Standbild.
            idle: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            // Die Sprunganimation ist auf 8 Frames begrenzt, um zur Dauer des Sprungs zu passen.
            jump: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/princess_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#FFC0CB'
    },
    'ninja': {
        playerAnimations: {
            // Benutzt das erste Frame des Sprung-Sheets als statisches Standbild.
            idle: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            // Die Sprunganimation ist auf 8 Frames begrenzt, um zur Dauer des Sprungs zu passen.
            jump: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/ninja_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#4F4F4F'
    }
};