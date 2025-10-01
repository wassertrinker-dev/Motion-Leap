/**
 * Repräsentiert die vom Spieler gesteuerte Figur.
 * Diese Klasse verwaltet die Position, Physik (Gravitation, Sprünge),
 * Zustände (IDLE, JUMPING, FALLING) und die dazugehörigen Animationen.
 */
export class Player {
    /**
     * Erstellt eine neue Spieler-Instanz.
     * @param {number} gameWidth - Die Gesamtbreite des Spielfelds.
     * @param {number} gameHeight - Die Gesamthöhe des Spielfelds.
     * @param {AnimationAssets} animations - Ein Objekt aus `themes.ts`, das die Pfade und Frame-Anzahlen für alle Animationen enthält.
     */
    constructor(gameWidth, gameHeight, animations) {
        /** Ein Flag, das anzeigt, ob das Bild des aktuellen Sprite Sheets fertig geladen ist. */
        this.isImageLoaded = false;
        /** Der horizontale Index des aktuellen Frames im Sprite Sheet (beginnend bei 0). */
        this.frameX = 0;
        /** Die Ziel-Frames pro Sekunde für die Animationen. */
        this.fps = 15;
        /** Ein Zähler, der die seit dem letzten Frame-Wechsel vergangene Zeit in Millisekunden speichert. */
        this.frameTimer = 0;
        // --- State Machine ---
        /** Der aktuelle Zustand des Spielers, der die Animation und das Verhalten steuert. */
        this.currentState = 'FALLING';
        this.width = 200;
        this.height = 200;
        this.x = 50;
        this.y = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.frameInterval = 1000 / this.fps;
        this.animations = animations;
        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.maxFrame = 0;
        this.setState('FALLING'); // Startet den Spieler im Fall-Zustand.
    }
    /**
     * Zeichnet den aktuellen Frame der Spieler-Animation an seiner Position auf die Canvas.
     * @param {CanvasRenderingContext2D} context - Der 2D-Rendering-Kontext der Canvas.
     * @returns {void}
     */
    draw(context) {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.frameX * this.width, // Quell-X im Sprite Sheet
            0, // Quell-Y im Sprite Sheet (immer 0 bei horizontalen Strips)
            this.width, // Quell-Breite des Frames
            this.height, // Quell-Höhe des Frames
            this.x, // Ziel-X auf der Canvas
            this.y, // Ziel-Y auf der Canvas
            this.width, // Ziel-Breite auf der Canvas
            this.height // Ziel-Höhe auf der Canvas
            );
        }
    }
    /**
     * Aktualisiert die Physik und den Animationszustand des Spielers für den nächsten Frame.
     * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Frame in Millisekunden.
     * @param {number} gameHeight - Die Höhe des Spielfelds für die Bodenkollisionserkennung.
     * @returns {void}
     */
    update(deltaTime, gameHeight) {
        // 1. Physik aktualisieren (Gravitation anwenden und Position ändern)
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        // 2. Zustandsübergänge basierend auf der Physik bestimmen
        // Am Boden angekommen
        if (this.y + this.height >= gameHeight && this.velocityY >= 0) {
            this.y = gameHeight - this.height;
            this.velocityY = 0;
            this.setState('IDLE');
        }
        // In der Luft und fällt
        else if (this.velocityY > 0) {
            this.setState('FALLING');
        }
        // In der Luft und steigt
        else if (this.velocityY < 0) {
            this.setState('JUMPING');
        }
        // 3. Animation des aktuellen Zustands fortschreiten lassen
        if (this.maxFrame > 0 && this.frameTimer > this.frameInterval) {
            this.frameX = (this.frameX + 1) % this.maxFrame; // Geht zum nächsten Frame, oder zurück zu 0 am Ende
            this.frameTimer = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }
    }
    /**
     * Setzt einen neuen Animationszustand für den Spieler (State Machine).
     * Lädt das entsprechende Sprite Sheet und setzt die Animation auf den ersten Frame zurück.
     * Wird nur ausgeführt, wenn sich der Zustand tatsächlich ändert.
     * @param {'IDLE' | 'JUMPING' | 'FALLING'} newState - Der neue Zustand, der gesetzt werden soll.
     * @returns {void}
     */
    setState(newState) {
        if (this.currentState === newState)
            return; // Verhindert unnötige Resets
        this.currentState = newState;
        switch (newState) {
            case 'IDLE':
                this.image.src = this.animations.jump.src; // Verwendet das Sprung-Sprite
                this.maxFrame = 1; // Friert die Animation auf dem ersten Frame ein
                break;
            case 'JUMPING':
                this.image.src = this.animations.jump.src;
                this.maxFrame = this.animations.jump.frameCount;
                break;
            case 'FALLING':
                this.image.src = this.animations.fall.src;
                this.maxFrame = this.animations.fall.frameCount;
                break;
        }
        this.frameX = 0; // Setzt die Animation bei jedem Zustandswechsel zurück
    }
    /**
     * Löst einen Sprung aus, indem eine negative vertikale Geschwindigkeit gesetzt wird.
     * Funktioniert nur, wenn der Spieler sich im 'IDLE'-Zustand (am Boden) befindet.
     * @returns {void}
     */
    jump() {
        if (this.currentState === 'IDLE') {
            this.velocityY = -20;
            this.setState('JUMPING');
        }
    }
}
