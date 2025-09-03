// in /src/themes.ts
/**
 * Eine Bibliothek, die alle verfügbaren Spiel-Themen enthält.
 */
export const themes = {
    'maerchen': {
        playerAnimations: {
            idle: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/princess_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/princess_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#FFC0CB'
    },
    'ninja': {
        playerAnimations: {
            idle: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 1 },
            jump: { src: 'assets/ninja_jump_1s_scaled_spritesheet.png', frameCount: 8 },
            fall: { src: 'assets/ninja_fall_1s_scaled_spritesheet.png', frameCount: 17 },
        },
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#4F4F4F'
    }
};
