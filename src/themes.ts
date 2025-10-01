// in /src/themes.ts

/**
 * Definiert die Struktur für die visuellen und animierten Eigenschaften eines Gegners innerhalb eines Themas.
 */
export interface EnemyAsset {
    /** Der Pfad zur Bilddatei des Gegners. */
    src: string;
    /** Die Breite der Kollisionsbox des Gegners in Pixeln. */
    width: number;
    /** Die Höhe der Kollisionsbox des Gegners in Pixeln. */
    height: number;
    /** Ein optionaler vertikaler Abstand vom Boden in Pixeln, um den Gegner "schweben" zu lassen. */
    yOffset?: number;
    /** Definiert die Partikelanimation, die bei der Zerstörung des Gegners abgespielt wird. */
    destruction: {
        /** Der Pfad zum Sprite-Sheet der Zerstörungsanimation. */
        src: string;
        /** Die Gesamtzahl der Frames in der Zerstörungsanimation. */
        frameCount: number;
        /** Die Darstellungsgröße (Breite und Höhe) der Zerstörungsanimation in Pixeln. */
        size: number;
    };
}

/**
 * Definiert die Struktur für die Animations-Assets einer Spielfigur.
 * Jedes Thema muss für die drei Kernzustände eine Animation bereitstellen.
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
 * Es bündelt alle themenspezifischen Assets und Konfigurationen.
 */
export interface GameTheme {
    /** Das Objekt, das alle Spieleranimationen für dieses Thema enthält. */
    playerAnimations: AnimationAssets;
    /** Das Objekt, das alle Eigenschaften des Gegners für dieses Thema enthält. */
    enemyAsset: EnemyAsset; 
    /** Die Hintergrundfarbe der HTML-Seite, passend zum Thema. */
    backgroundColor: string;
    /** Der Pfad zum Bild für den scrollenden Parallax-Hintergrund. */
    backgroundImageSrc: string;
    /** Der Pfad zum Video, das auf dem "Level geschafft!"-Bildschirm abgespielt wird. */
    winVideoSrc: string;
}

/**
 * Eine zentrale Bibliothek, die alle verfügbaren Spiel-Themen enthält.
 * Der Schlüssel eines jeden Eintrags (z.B. 'maerchen') muss exakt mit dem
 * `data-theme`-Attribut der entsprechenden Auswahlkarte in der `index.html` übereinstimmen.
 * 
 * @example
 * // Um ein neues Thema hinzuzufügen:
 * // 1. Erstelle einen neuen Eintrag hier (z.B. 'weltraum': { ... }).
 * // 2. Füge alle benötigten Bild- und Videodateien zum `/dist/assets`-Ordner hinzu.
 * // 3. Erstelle eine neue Themen-Auswahlkarte in der `index.html` mit `data-theme="weltraum"`.
 */
export const themes: { [key: string]: GameTheme } = {
    'maerchen': {
        playerAnimations: {
            idle: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/princess_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyAsset: { 
            src: 'assets/ghost_bubble_tr.png',
            width: 120,
            height: 120,
            yOffset: 10,
            destruction: {
                src: 'assets/ghost_spritesheet.png',
                frameCount: 6,
                size: 150
            }
        },
        backgroundColor: '#FFC0CB',
        backgroundImageSrc: 'assets/prinzessin_BG.png',
        winVideoSrc: 'assets/princess_win.webm'
    },
    'ninja': {
        playerAnimations: {
            idle: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/ninja_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyAsset: { 
            src: 'assets/monk_tra.png',
            width: 120,
            height: 120,
            yOffset: 10,
            destruction: {
                src: 'assets/bird_spritesheet.png',
                frameCount: 6,
                size: 150
            }
        },
        backgroundColor: '#4F4F4F',
        backgroundImageSrc: 'assets/ninja_BG.png',
        winVideoSrc: 'assets/ninja_win.webm'
    }
};