// in /src/enemy.ts
/**
 * Repräsentiert einen feindlichen Gegner, der sich als Hindernis über den Bildschirm bewegt.
 * Jede Instanz dieser Klasse verwaltet ihre eigene Position, ihr Aussehen und ihre Bewegung.
 */
export class Enemy {
    /**
     * Erstellt eine neue Gegner-Instanz.
     * Der Gegner wird standardmäßig direkt außerhalb des rechten Bildschirmrands und am Boden platziert.
     * @param gameWidth Die Gesamtbreite des Spielfelds, um die Startposition festzulegen.
     * @param gameHeight Die Gesamthöhe des Spielfelds, um die Position am Boden zu berechnen.
     * @param imageSrc Der Pfad zur Bilddatei für den Gegner, der vom aktuellen Thema bestimmt wird.
     */
    constructor(gameWidth, gameHeight, imageSrc) {
        /** Ein Schalter, der anzeigt, ob das Bild des Gegners fertig geladen ist, um Zeichenfehler zu vermeiden. */
        this.isImageLoaded = false;
        this.width = 60;
        this.height = 100;
        this.speed = 4;
        this.x = gameWidth;
        this.y = gameHeight - this.height;
        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.image.src = imageSrc;
    }
    /**
     * Zeichnet das Bild des Gegners an seiner aktuellen Position auf die Canvas.
     * @param context Der 2D-Rendering-Kontext der Canvas, auf den gezeichnet werden soll.
     */
    draw(context) {
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
