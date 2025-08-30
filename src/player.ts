// in /src/player.ts

/**
 * Repräsentiert die vom Spieler gesteuerte Figur.
 * Diese Klasse kümmert sich um die eigene Position, die Physik (Schwerkraft, Sprung)
 * und das Zeichnen der Figur auf die Canvas.
 */
export class Player {
    /** Die horizontale Position (linke Kante) des Spielers. */
    x: number;
    /** Die vertikale Position (obere Kante) des Spielers. 0 ist der obere Bildschirmrand. */
    y: number;
    /** Die Breite der Spielerfigur in Pixel. */
    width: number;
    /** Die Höhe der Spielerfigur in Pixel. */
    height: number;
    /** Die Farbe, in der die Spielerfigur gezeichnet wird. */
    color: string;
    /** 
     * Die vertikale Geschwindigkeit des Spielers. 
     * Ein positiver Wert bedeutet eine Bewegung nach unten, ein negativer Wert nach oben.
     */
    velocityY: number;
    /** Die Kraft der Schwerkraft, die in jedem Frame auf `velocityY` addiert wird. */
    gravity: number;

    /**
     * Erstellt eine neue Spieler-Instanz.
     * @param gameWidth Die Gesamtbreite des Spielfelds. (Wird derzeit nicht verwendet, aber für zukünftige Logik beibehalten).
     * @param gameHeight Die Gesamthöhe des Spielfelds, wichtig für die Bodenkollision in `update`.
     */
    constructor(gameWidth: number, gameHeight: number) {
        this.width = 50;
        this.height = 50;
        this.x = 50;
        this.y = 0; // Startet am oberen Rand
        this.color = 'red';
        this.velocityY = 0;
        this.gravity = 0.5;
    }

    /**
     * Zeichnet den Spieler als rotes Rechteck an seiner aktuellen Position auf die Canvas.
     * @param context Der 2D-Rendering-Kontext der Canvas, auf den gezeichnet werden soll.
     */
    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Aktualisiert den Zustand des Spielers für den nächsten Frame.
     * Diese Methode wendet die Schwerkraft an und prüft auf eine Kollision mit dem Boden.
     * @param gameHeight Die Höhe des Spielfelds, um die Position des Bodens zu kennen.
     */
    update(gameHeight: number) {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Verhindert, dass der Spieler durch den Boden fällt.
        if (this.y + this.height > gameHeight) {
            this.y = gameHeight - this.height;
            this.velocityY = 0;
        }
    }

    /**
     * Wendet einen sofortigen vertikalen Impuls auf den Spieler an, um einen Sprung zu simulieren.
     * Funktioniert nur, wenn der Spieler sich am Boden befindet (erkennbar an `velocityY === 0`).
     * Dadurch werden Doppelsprünge in der Luft verhindert.
     */
    jump() {
        if (this.velocityY === 0) {
            this.velocityY = -20;
        }
    }
}