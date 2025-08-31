// in /src/enemy.ts

export class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    image: HTMLImageElement;
    isImageLoaded: boolean = false;

    constructor(gameWidth: number, gameHeight: number, imageSrc: string) { // <-- NIMMT JETZT imageSrc ENTGEGEN
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

    draw(context: CanvasRenderingContext2D) {
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.x -= this.speed;
    }
}