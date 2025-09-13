// in /src/enemy.ts

import { EnemyAsset } from './themes.js';

/**
 * Repräsentiert einen feindlichen Gegner, der sich als Hindernis über den Bildschirm bewegt.
 * Jede Instanz dieser Klasse verwaltet ihre eigene Position, ihr Aussehen und ihre Bewegung.
 */
export class Enemy {
    /** Die horizontale Position (linke Kante) des Gegners. */
    x: number;
    /** Die vertikale Position (obere Kante) des Gegners. */
    y: number;
    /** Die Breite des Gegners in Pixel. */
    width: number;
    /** Die Höhe des Gegners in Pixel. */
    height: number;
    /** Die Geschwindigkeit in Pixel pro Frame, mit der sich der Gegner von rechts nach links bewegt. */
    speed: number;
    /** Das Bild-Element, das den Gegner darstellt (z.B. eine Mauer oder ein Wurfstern). */
    image: HTMLImageElement;
    /** Ein Schalter, der anzeigt, ob das Bild des Gegners fertig geladen ist, um Zeichenfehler zu vermeiden. */
    isImageLoaded: boolean = false;

    /**
     * Erstellt eine neue Gegner-Instanz.
     * Der Gegner wird standardmäßig direkt außerhalb des rechten Bildschirmrands und am Boden platziert.
     * @param gameWidth Die Gesamtbreite des Spielfelds, um die Startposition festzulegen.
     * @param gameHeight Die Gesamthöhe des Spielfelds, um die Position am Boden zu berechnen.
     * @param imageSrc Der Pfad zur Bilddatei für den Gegner, der vom aktuellen Thema bestimmt wird.
     */
    constructor(gameWidth: number, gameHeight: number, asset: EnemyAsset) {
        this.width = asset.width;
        this.height = asset.height;
        this.speed = 4;
        this.x = gameWidth;
        
        // HIER IST DIE KORRIGIERTE LOGIK:
        // 1. Berechne die Position, an der die Kollisionsbox den Boden berührt
        const groundPosition = gameHeight - this.height;
        
        // 2. Subtrahiere den Offset, um die Figur nach oben zu verschieben
        this.y = groundPosition - (asset.yOffset || 0);

        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.image.src = asset.src;
    }


    /**
     * Zeichnet das Bild des Gegners an seiner aktuellen Position auf die Canvas.
     * @param context Der 2D-Rendering-Kontext der Canvas, auf den gezeichnet werden soll.
     */
    draw(context: CanvasRenderingContext2D) {
        // Zeichnet nur, wenn das Bild erfolgreich geladen wurde, um Fehler zu vermeiden.
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Aktualisiert den Zustand des Gegners für den nächsten Frame.
     * Die Hauptaufgabe dieser Methode ist es, den Gegner nach links zu bewegen.
     */
    update() {
        // Verringert die x-Position, um eine Bewegung von rechts nach links zu erzeugen.
        this.x -= this.speed;
    }
}