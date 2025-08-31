// in /src/themes.ts

// Ein "Bauplan" dafür, wie jedes Thema aussehen muss.
// Das hilft uns, Tippfehler zu vermeiden.
export interface GameTheme {
    playerImageSrc: string;
    enemyImageSrc: string;
    // Zukünftige Ideen:
    backgroundColor: string;
    // jumpSoundSrc: string;
}

// Die Bibliothek unserer verfügbaren Themen.
export const themes: { [key: string]: GameTheme } = {
    'maerchen': {
        playerImageSrc: 'assets/princess_stand.png',
        enemyImageSrc: 'assets/brickwall.png', // z.B. eine giftige Blume
        backgroundColor: '#FFC0CB' // Hellrosa
    },
    'ninja': {
        playerImageSrc: 'assets/ninja_stand.png',
        enemyImageSrc: 'assets/brickwall.png',
        backgroundColor: '#4F4F4F' // Dunkelgrau
    }
};