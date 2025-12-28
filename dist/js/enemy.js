// in /src/enemy.ts
/**
 * Repräsentiert einen feindlichen Gegner, der sich als Hindernis über den Bildschirm bewegt.
 * Jede Instanz dieser Klasse verwaltet ihre eigene Position, ihr Aussehen und ihre Bewegung.
 */
export class Enemy {
    /**
     * Erstellt eine neue Gegner-Instanz.
     * @param {number} gameWidth - Die Gesamtbreite des Spielfelds.
     * @param {number} gameHeight - Die Gesamthöhe des Spielfelds.
     * @param {EnemyBehavior} speedBehavior - Das Geschwindigkeitsverhalten aus `levels.ts`.
     * @param {EnemyAsset} visualAsset - Die visuellen Assets aus `themes.ts`.
     */
    constructor(gameWidth, gameHeight, speedBehavior, visualAsset) {
        /** Ein Flag, das anzeigt, ob das Bild des Gegners fertig geladen ist, um Zeichenfehler zu vermeiden. */
        this.isImageLoaded = false;
        this.width = visualAsset.width;
        this.height = visualAsset.height;
        this.speed = speedBehavior.baseSpeed + (Math.random() * speedBehavior.speedVariance);
        this.x = gameWidth;
        const groundPosition = gameHeight - this.height;
        this.y = groundPosition - (visualAsset.yOffset || 0);
        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.image.src = visualAsset.src;
    }
    /**
     * Zeichnet das Bild des Gegners an seiner aktuellen Position auf die Canvas.
     * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext der Canvas.
     * @returns {void}
     */
    draw(context) {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    /**
     * Aktualisiert den Zustand des Gegners für den nächsten Frame.
     * @returns {void}
     */
    update(deltaTime) {
        const timeFactor = deltaTime / 16.67; // 60 FPS Ziel
        this.x -= this.speed * timeFactor;
    }
}
