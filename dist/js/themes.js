// in /src/themes.ts
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
export const themes = {
    'maerchen': {
        playerAnimations: {
            idle: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/princess_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        backgroundColor: '#FFC0CB',
        backgroundImageSrc: 'assets/prinzessin_BG.png',
        backgroundMusicSrc: 'assets/princess_theme.mp3',
        winVideoSrc: 'assets/princess_win.webm',
        scoreSoundSrc: 'assets.ghost.mp3', // POSITIV
        damageSoundSrc: 'assets/bounce.mp3', // NEGATIV (der alte "hit sound")
        enemyBehavior: {
            src: 'assets/ghost_bubble_tr.png',
            width: 120,
            height: 120,
            yOffset: 10,
            destruction: {
                src: 'assets/ghost_spritesheet.png',
                frameCount: 6,
                size: 150
            }
        }
    },
    'ninja': {
        playerAnimations: {
            idle: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/ninja_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        backgroundColor: '#4F4F4F',
        backgroundImageSrc: 'assets/ninja_BG.png',
        backgroundMusicSrc: 'assets/ninja_theme.mp3',
        winVideoSrc: 'assets/ninja_win.webm',
        scoreSoundSrc: 'assets/bird.mp3', // POSITIV
        damageSoundSrc: 'assets/bounce.mp3', // NEGATIV (der alte "hit sound")
        enemyBehavior: {
            src: 'assets/monk_tra.png',
            width: 120,
            height: 120,
            yOffset: 10,
            destruction: {
                src: 'assets/bird_spritesheet.png',
                frameCount: 6,
                size: 150
            }
        }
    }
};
