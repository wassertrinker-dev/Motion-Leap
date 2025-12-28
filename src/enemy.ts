// in /src/enemy.ts

import { EnemyBehavior } from './levels.js';
import { EnemyAsset } from './themes.js';

/**
 * Repräsentiert einen feindlichen Gegner, der sich als Hindernis über den Bildschirm bewegt.
 * Jede Instanz dieser Klasse verwaltet ihre eigene Position, ihr Aussehen und ihre Bewegung.
 */
export class Enemy {
    /** Die horizontale Position (linke Kante) des Gegners in Pixeln. */
    x: number;
    /** Die vertikale Position (obere Kante) des Gegners in Pixeln. */
    y: number;
    /** Die Breite des Gegners in Pixeln. */
    width: number;
    /** Die Höhe des Gegners in Pixeln. */
    height: number;
    /** Die Geschwindigkeit in Pixeln pro Frame, mit der sich der Gegner von rechts nach links bewegt. */
    speed: number;
    /** Das HTMLImageElement, das den Gegner darstellt. */
    image: HTMLImageElement;
    /** Ein Flag, das anzeigt, ob das Bild des Gegners fertig geladen ist, um Zeichenfehler zu vermeiden. */
    isImageLoaded: boolean = false;

    /**
     * Erstellt eine neue Gegner-Instanz.
     * @param {number} gameWidth - Die Gesamtbreite des Spielfelds.
     * @param {number} gameHeight - Die Gesamthöhe des Spielfelds.
     * @param {EnemyBehavior} speedBehavior - Das Geschwindigkeitsverhalten aus `levels.ts`.
     * @param {EnemyAsset} visualAsset - Die visuellen Assets aus `themes.ts`.
     */
    constructor(gameWidth: number, gameHeight: number, speedBehavior: EnemyBehavior, visualAsset: EnemyAsset) {
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
    draw(context: CanvasRenderingContext2D): void {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Aktualisiert den Zustand des Gegners für den nächsten Frame.
     * @returns {void}
     */
    update(deltaTime: number): void {
        const timeFactor = deltaTime / 16.67; // 60 FPS Ziel
        this.x -= this.speed * timeFactor;
    }
}
