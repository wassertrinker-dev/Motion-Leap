// in /src/particle.ts
/**
 * Repräsentiert eine Partikelanimation, die einmalig abgespielt wird (z.B. eine Explosion).
 * Die Partikel-Instanz verwaltet ihre eigene Sprite-Sheet-Animation und markiert sich
 * selbst zur Löschung, nachdem die Animation abgeschlossen ist.
 */
export class Particle {
    /**
     * Erstellt eine neue Partikelanimation.
     * @param {number} x - Die horizontale Mittelpunkt-Position, an der das Partikel erscheinen soll.
     * @param {number} y - Die vertikale Mittelpunkt-Position, an der das Partikel erscheinen soll.
     * @param {string} imageSrc - Der Pfad zum Sprite-Sheet-Bild für die Animation.
     * @param {number} frameCount - Die Gesamtzahl der Frames im Sprite Sheet.
     * @param {number} size - Die gewünschte Darstellungsgröße (Breite und Höhe) des Partikels.
     */
    constructor(x, y, imageSrc, frameCount, size) {
        /** Ein Flag, das der Game-Loop signalisiert, dass dieses Partikel entfernt werden kann. */
        this.markedForDeletion = false;
        /** Der horizontale Index des aktuellen Frames im Sprite Sheet (beginnend bei 0). */
        this.frameX = 0;
        /** Die Ziel-Frames pro Sekunde für die Animation. */
        this.fps = 17;
        /** Ein Zähler, der die seit dem letzten Frame-Wechsel vergangene Zeit in Millisekunden speichert. */
        this.frameTimer = 0;
        this.size = size;
        // Position wird so angepasst, dass das Partikel am übergebenen Punkt zentriert ist.
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.image = new Image();
        this.image.src = imageSrc;
        this.maxFrame = frameCount;
        this.frameInterval = 1000 / this.fps;
    }
    /**
     * Aktualisiert den Animationszustand des Partikels für den nächsten Frame.
     * Zählt den Frame-Timer hoch und wechselt zum nächsten Frame, wenn das `frameInterval` erreicht ist.
     * Wenn der letzte Frame angezeigt wurde, wird `markedForDeletion` auf `true` gesetzt.
     * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Frame in Millisekunden.
     * @returns {void}
     */
    update(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0; // Timer zurücksetzen
            if (this.frameX < this.maxFrame - 1) {
                // Zum nächsten Frame wechseln, wenn die Animation noch nicht zu Ende ist.
                this.frameX++;
            }
            else {
                // Die Animation ist beendet, das Partikel kann entfernt werden.
                this.markedForDeletion = true;
            }
        }
    }
    /**
     * Zeichnet den aktuellen Frame der Partikelanimation auf die Canvas.
     * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext der Canvas.
     * @returns {void}
     */
    draw(context) {
        // Sicherheitsabfrage, um Fehler zu vermeiden, falls das Bild noch nicht vollständig geladen ist.
        if (!this.image.complete || this.image.naturalHeight === 0)
            return;
        // Berechnet die Breite eines einzelnen Frames aus der Gesamtbreite des Sprite Sheets.
        const frameWidth = this.image.width / this.maxFrame;
        const frameHeight = this.image.height; // Nimmt an, dass das Sprite Sheet eine einzelne Zeile ist.
        context.drawImage(this.image, this.frameX * frameWidth, // Quell-X im Sprite Sheet
        0, // Quell-Y im Sprite Sheet
        frameWidth, // Quell-Breite des Frames
        frameHeight, // Quell-Höhe des Frames
        this.x, // Ziel-X auf der Canvas
        this.y, // Ziel-Y auf der Canvas
        this.size, // Ziel-Breite auf der Canvas
        this.size // Ziel-Höhe auf der Canvas
        );
    }
}
