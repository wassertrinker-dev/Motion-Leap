// in /src/enemy.ts
export class Enemy {
    constructor(gameWidth, gameHeight, imageSrc) {
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
        this.image.src = imageSrc; // <-- BENUTZT JETZT imageSrc
    }
    draw(context) {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    update() {
        this.x -= this.speed;
    }
}
