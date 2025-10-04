// in /src/enemy.ts

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
     * Der Gegner wird initial außerhalb des rechten Bildschirmrands platziert und bewegt sich nach links.
     * Die vertikale Position wird basierend auf der `gameHeight` und einem optionalen Offset berechnet.
     * @param {number} gameWidth - Die Gesamtbreite des Spielfelds, um die Startposition festzulegen.
     * @param {number} gameHeight - Die Gesamthöhe des Spielfelds, um die Position am Boden zu berechnen.
     * @param {EnemyAsset} asset - Das Konfigurationsobjekt aus `themes.ts`, das Bildquelle, Größe und Offset enthält.
     */
    constructor(gameWidth: number, gameHeight: number, asset: EnemyAsset) {
        this.width = asset.width;
        this.height = asset.height;
        this.speed = 4;
        this.x = gameWidth;
        
        // Berechnet die Y-Position, sodass die Unterkante der Kollisionsbox den Boden berührt,
        // und wendet dann den themenspezifischen yOffset an, um die Figur ggf. schweben zu lassen.
        const groundPosition = gameHeight - this.height;
        this.y = groundPosition - (asset.yOffset || 0);

        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.image.src = asset.src;
    }

    /**
     * Zeichnet das Bild des Gegners an seiner aktuellen Position auf die Canvas.
     * Die Methode prüft intern, ob das Bild bereits geladen ist.
     * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext der Canvas, auf den gezeichnet werden soll.
     * @returns {void}
     */
    draw(context: CanvasRenderingContext2D): void {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Aktualisiert den Zustand des Gegners für den nächsten Frame.
     * Die Hauptaufgabe dieser Methode ist es, den Gegner um seine `speed` nach links zu bewegen.
     * @returns {void}
     */
    update(deltaTime: number): void {
        const timeFactor = deltaTime / 16.67; // 60 FPS Ziel
        this.x -= this.speed * timeFactor;
    }
}
