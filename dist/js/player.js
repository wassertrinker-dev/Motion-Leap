/**
 * Repräsentiert die vom Spieler gesteuerte Figur mit Zuständen und Animationen.
 */
export class Player {
    /**
     * Erstellt eine neue Spieler-Instanz.
     * @param gameWidth Die Gesamtbreite des Spielfelds.
     * @param gameHeight Die Gesamthöhe des Spielfelds.
     * @param animations Ein Objekt, das die Pfade und Frame-Anzahlen für alle Animationen enthält.
     */
    constructor(gameWidth, gameHeight, animations) {
        this.isImageLoaded = false;
        this.frameX = 0;
        this.fps = 15;
        this.frameTimer = 0;
        // State Machine
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
        this.setState('FALLING');
    }
    /**
     * Zeichnet den aktuellen Frame der Spieler-Animation auf die Canvas.
     * @param context Der 2D-Rendering-Kontext der Canvas.
     */
    draw(context) {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.frameX * this.width, 0, // frameY ist 0, da wir separate Sprite Sheets pro Animation haben
            this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }
    /**
     * Aktualisiert die Physik und den Animationszustand des Spielers für den nächsten Frame.
     * @param deltaTime Die vergangene Zeit seit dem letzten Frame in Millisekunden.
     * @param gameHeight Die Höhe des Spielfelds für die Bodenkollisionserkennung.
     */
    update(deltaTime, gameHeight) {
        // 1. Physik aktualisieren
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        // 2. Zustandsübergänge basierend auf der Physik bestimmen
        if (this.y + this.height >= gameHeight && this.velocityY >= 0) {
            this.y = gameHeight - this.height;
            this.velocityY = 0;
            this.setState('IDLE');
        }
        else if (this.velocityY > 0) {
            this.setState('FALLING');
        }
        else if (this.velocityY < 0) {
            this.setState('JUMPING');
        }
        // 3. Den aktuellen Frame der Animation weiterzählen
        if (this.maxFrame > 0 && this.frameTimer > this.frameInterval) {
            this.frameX = (this.frameX + 1) % this.maxFrame;
            this.frameTimer = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }
    }
    /**
     * Setzt einen neuen Animationszustand für den Spieler.
     * Lädt das entsprechende Sprite Sheet und setzt die Animation zurück.
     * @param newState Der neue Zustand ('IDLE', 'JUMPING', oder 'FALLING').
     */
    setState(newState) {
        if (this.currentState === newState)
            return; // Verhindert unnötige Resets
        this.currentState = newState;
        switch (newState) {
            case 'IDLE':
                this.image.src = this.animations.jump.src;
                this.maxFrame = 1; // Animation anhalten
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
        this.frameX = 0; // Animation von vorne starten
    }
    /**
     * Löst einen Sprung aus, wenn der Spieler am Boden ist.
     * Setzt die Physik und startet sofort die Sprunganimation.
     */
    jump() {
        if (this.currentState === 'IDLE') {
            this.velocityY = -20;
            this.setState('JUMPING');
        }
    }
}
