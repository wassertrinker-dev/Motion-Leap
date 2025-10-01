// in /src/background.ts

/**
 * Erstellt einen unendlich scrollenden Parallax-Hintergrund.
 * Diese Klasse verwendet zwei identische Bilder, die nahtlos aneinandergereiht
 * und kontinuierlich nach links verschoben werden, um die Illusion einer
 * unendlichen Bewegung zu erzeugen.
 */
export class Background {
    /** Die horizontale Position des ersten Hintergrundbildes in Pixeln. */
    x1: number;
    /** Die horizontale Position des zweiten Hintergrundbildes in Pixeln. */
    x2: number;
    /** Die vertikale Position der Hintergrundbilder in Pixeln (standardmäßig 0). */
    y: number;
    /** Die Breite eines einzelnen Hintergrundbildes, die der Breite des Spiels entspricht. */
    width: number;
    /** Die Höhe eines einzelnen Hintergrundbildes, die der Höhe des Spiels entspricht. */
    height: number;
    /** Das `HTMLImageElement`, das als Kachel für den Hintergrund verwendet wird. */
    image: HTMLImageElement;
    /** Die Geschwindigkeit in Pixeln pro Frame, mit der der Hintergrund nach links scrollt. */
    speed: number;

    /**
     * Erstellt eine neue Instanz des scrollenden Hintergrunds.
     * @param {number} gameWidth - Die Breite des Spiels, die für die Breite des Hintergrunds verwendet wird.
     * @param {number} gameHeight - Die Höhe des Spiels, die für die Höhe des Hintergrunds verwendet wird.
     * @param {string} imageSrc - Der Pfad zur Bilddatei für den Hintergrund.
     * @param {number} speed - Die Scroll-Geschwindigkeit.
     */
    constructor(gameWidth: number, gameHeight: number, imageSrc: string, speed: number) {
        this.width = gameWidth;
        this.height = gameHeight;
        this.x1 = 0;
        this.x2 = this.width; // Das zweite Bild startet direkt rechts neben dem ersten.
        this.y = 0;
        this.speed = speed;

        this.image = new Image();
        this.image.src = imageSrc;
    }

    /**
     * Aktualisiert die Positionen der beiden Hintergrundbilder, um den Scrolleffekt zu erzeugen.
     * Wenn ein Bild vollständig aus dem sichtbaren Bereich nach links verschoben wurde,
     * wird es nahtlos an das rechte Ende des anderen Bildes gesetzt, um eine Endlosschleife zu bilden.
     * @returns {void}
     */
    update(): void {
        // Bewegt beide Bilder mit der festgelegten Geschwindigkeit nach links.
        this.x1 -= this.speed;
        this.x2 -= this.speed;

        // Wenn das erste Bild komplett aus dem Bildschirm verschwunden ist,
        // setze es an das rechte Ende der Kette.
        if (this.x1 < -this.width) {
            this.x1 = this.width + this.x2 - this.speed;
        }
        // Das Gleiche für das zweite Bild.
        if (this.x2 < -this.width) {
            this.x2 = this.width + this.x1 - this.speed;
        }
    }

    /**
     * Zeichnet die beiden Hintergrundbilder an ihren aktuellen Positionen auf die Canvas.
     * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext, auf den gezeichnet werden soll.
     * @returns {void}
     */
    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.image, this.x1, this.y, this.width, this.height);
        context.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}