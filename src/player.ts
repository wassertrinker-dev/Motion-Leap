// KEINE IMPORT-ZEILE HIER!

export class Player { // Das "export" ist hier das Wichtigste
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    velocityY: number;
    gravity: number;

    constructor(gameWidth: number, gameHeight: number) {
        this.width = 50;
        this.height = 50;
        this.x = 50;
        this.y = gameHeight - this.height;
        this.color = 'red';
        this.velocityY = 0;
        this.gravity = 0.5;
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
    }
}