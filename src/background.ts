// in /src/background.ts

export class Background {
    x1: number;
    x2: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    speed: number;

    constructor(gameWidth: number, gameHeight: number, imageSrc: string, speed: number) {
        this.width = gameWidth;
        this.height = gameHeight;
        this.x1 = 0;
        this.x2 = this.width; // Das zweite Bild startet direkt rechts neben dem ersten
        this.y = 0;
        this.speed = speed;

        this.image = new Image();
        this.image.src = imageSrc;
    }

    update() {
        // Bewege beide Bilder nach links
        this.x1 -= this.speed;
        this.x2 -= this.speed;

        // Wenn das erste Bild komplett aus dem Bildschirm nach links verschwunden ist,
        // setze es wieder an das rechte Ende der Kette.
        if (this.x1 < -this.width) {
            this.x1 = this.width + this.x2 - this.speed; // Präzise Positionierung
        }
        // Das Gleiche für das zweite Bild
        if (this.x2 < -this.width) {
            this.x2 = this.width + this.x1 - this.speed;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, this.x1, this.y, this.width, this.height);
        context.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}