// KEINE IMPORT-ZEILE HIER!
export class Player {
    constructor(gameWidth, gameHeight) {
        this.width = 50;
        this.height = 50;
        this.x = 50;
        this.y = gameHeight - this.height;
        this.color = 'red';
        this.velocityY = 0;
        this.gravity = 0.5;
    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
    }
}
