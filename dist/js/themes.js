// in /src/themes.ts
/**
 * Eine Bibliothek, die alle verfügbaren Spiel-Themen enthält.
 * Der Schlüssel (z.B. 'maerchen') muss mit dem `data-theme`-Attribut im HTML übereinstimmen.
 *
 * Um ein neues Thema hinzuzufügen:
 * 1. Erstelle einen neuen Eintrag hier (z.B. 'weltraum': { ... }).
 * 2. Füge die benötigten Bilddateien zum `/dist/assets`-Ordner hinzu.
 * 3. Erstelle eine neue Themen-Auswahlkarte in der `index.html`.
 */
export const themes = {
    'maerchen': {
        playerAnimations: {
            // Benutzt das erste Frame des Sprung-Sheets als statisches Standbild.
            idle: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            // Die Sprunganimation ist auf 8 Frames begrenzt, um zur Dauer des Sprungs zu passen.
            jump: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/princess_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyAsset: {
            src: 'assets/ghost_bubble_tr.png', // Der neue Dateiname
            width: 120, // Die ermittelte Breite des Geistes
            height: 120, // Die ermittelte Höhe
            yOffset: 10, // Der ermittelte Offset
            // NEU: Definiere die Zerstörungs-Animation für dieses Thema
            destruction: {
                src: 'assets/ghost_spritesheet.png',
                frameCount: 6, // WICHTIG: Passe das an dein Sprite Sheet an!
                size: 150 // Wähle eine gute Größe für die Explosion
            }
        },
        backgroundColor: '#FFC0CB',
        backgroundImageSrc: 'assets/prinzessin_BG.png' // NEU
    },
    'ninja': {
        playerAnimations: {
            // Benutzt das erste Frame des Sprung-Sheets als statisches Standbild.
            idle: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            // Die Sprunganimation ist auf 8 Frames begrenzt, um zur Dauer des Sprungs zu passen.
            jump: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/ninja_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyAsset: {
            src: 'assets/monk_tra.png', // Der neue Dateiname
            width: 120, // Die ermittelte Breite des Geistes
            height: 120, // Die ermittelte Höhe
            yOffset: 10, // Der ermittelte Offset
            // NEU: Definiere die Zerstörungs-Animation für dieses Thema
            destruction: {
                src: 'assets/bird_spritesheet.png',
                frameCount: 6, // WICHTIG: Passe das an dein Sprite Sheet an!
                size: 150
            }
        },
        backgroundColor: '#4F4F4F',
        backgroundImageSrc: 'assets/ninja_BG.png' // NEU
    }
};
