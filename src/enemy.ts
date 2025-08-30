
export class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;

    constructor(gameWidth: number, gameHeight: number) {
        this.width = 50;
        this.height = 80; // Machen wir ihn etwas größer als den Spieler
        this.color = 'blue';
        this.speed = 4; // Wie schnell er sich bewegt. Spiel mit diesem Wert!

        // Startposition: Ganz rechts, außerhalb des Bildes
        this.x = gameWidth; 
        // Position am Boden
        this.y = gameHeight - this.height;
    }

    // Zeichnet den Gegner
    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    // Bewegt den Gegner
    update() {
        this.x -= this.speed; // In jedem Frame nach links bewegen
    }
}