// in /src/themes.ts

/**
 * Definiert die Struktur für die Animations-Assets eines Themas.
 */
export interface AnimationAssets {
    idle: { src: string; frameCount: number };
    jump: { src: string; frameCount: number };
    fall: { src: string; frameCount: number };
    // Zukünftige Animationen: land, run, etc.
}

/**
 * Definiert die Struktur für ein komplettes visuelles Thema.
 */
export interface GameTheme {
    playerAnimations: AnimationAssets; // Statt nur einem Bild, jetzt ein ganzes Set
    enemyImageSrc: string;
    backgroundColor: string;
}

/**
 * Eine Bibliothek, die alle verfügbaren Spiel-Themen enthält.
 */
export const themes: { [key: string]: GameTheme } = {
    'maerchen': {
        playerAnimations: {
            idle: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 8 }, // not more then 8 frames due to jump time
            fall: { src: 'assets/princess_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#FFC0CB'
    },
    'ninja': {
        playerAnimations: {
            idle: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 8 }, // not more then 8 frames due to jump time
            fall: { src: 'assets/ninja_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#4F4F4F'
    }
};