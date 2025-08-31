// in /src/enemy.ts
/**
 * Repräsentiert einen feindlichen Gegner, der sich als Hindernis über den Bildschirm bewegt.
 */
export class Enemy {
    /**
     * Erstellt eine neue Gegner-Instanz.
     * @param gameWidth Die Gesamtbreite des Spielfelds.
     * @param gameHeight Die Gesamthöhe des Spielfelds.
     */
    constructor(gameWidth, gameHeight) {
        this.isImageLoaded = false; // Wichtiger Schalter, um Fehler zu vermeiden
        // Passe diese Werte an die Proportionen deines Bildes an
        this.width = 60;
        this.height = 100;
        this.speed = 4;
        this.x = gameWidth;
        this.y = gameHeight - this.height;
        // NEU: Der Ladevorgang für das Bild
        this.image = new Image(); // Erstellt ein leeres Bild-Objekt im Speicher
        // Dieser Code wird ausgeführt, SOBALD das Bild fertig geladen ist
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        // DIESE Zeile startet den Ladevorgang. Der Pfad ist relativ zur index.html!
        this.image.src = 'asset/brickwall.png';
    }
    /**
     * Zeichnet das Mauer-Bild an seiner aktuellen Position.
     * @param context Der 2D-Rendering-Kontext der Canvas.
     */
    draw(context) {
        // ÄNDERUNG: Wir ersetzen das Malen des Rechtecks durch das Malen des Bildes.
        // Wir prüfen vorher, ob das Bild schon geladen ist, um Fehler zu vermeiden.
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    /**
     * Aktualisiert die Position des Gegners für den nächsten Frame.
     */
    update() {
        this.x -= this.speed;
    }
}
