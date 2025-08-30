
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
    /** Die Farbe, in der der Gegner gezeichnet wird. */
    color: string;
    /** Die Geschwindigkeit in Pixel pro Frame, mit der sich der Gegner von rechts nach links bewegt. */
    speed: number;

    /**
     * Erstellt eine neue Gegner-Instanz.
     * Der Gegner wird standardmäßig direkt außerhalb des rechten Bildschirmrands und am Boden platziert.
     * @param gameWidth Die Gesamtbreite des Spielfelds, um die Startposition festzulegen.
     * @param gameHeight Die Gesamthöhe des Spielfelds, um die Position am Boden zu berechnen.
     */
    constructor(gameWidth: number, gameHeight: number) {
        this.width = 50;
        this.height = 80;
        this.color = 'blue';
        this.speed = 4;

        this.x = gameWidth; // Startet direkt außerhalb des rechten Rands
        this.y = gameHeight - this.height; // Startet am Boden
    }

    /**
     * Zeichnet den Gegner als blaues Rechteck an seiner aktuellen Position.
     * @param context Der 2D-Rendering-Kontext der Canvas, auf den gezeichnet werden soll.
     */
    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
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