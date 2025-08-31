// in /src/player.ts

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
    gravity: number;

    // NEU: Die 'image'-Eigenschaft deklarieren
    image: HTMLImageElement;
    isImageLoaded: boolean = false;

    constructor(gameWidth: number, gameHeight: number, imageSrc: string) { // <-- NIMMT JETZT imageSrc ENTGEGEN
        this.width = 40;
        this.height = 100; // Passe das an die Größe deiner Spielerfigur an
        this.x = 50;
        this.y = 0;
        this.velocityY = 0;
        this.gravity = 0.5;

        // NEU: Lade das Bild, das übergeben wurde
        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.image.src = imageSrc; // <-- BENUTZT JETZT imageSrc
    }

    draw(context: CanvasRenderingContext2D) {
        // ÄNDERUNG: Malt jetzt das Bild statt eines roten Rechtecks
        if (this.isImageLoaded) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    update(gameHeight: number) {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y + this.height > gameHeight) {
            this.y = gameHeight - this.height;
            this.velocityY = 0;
        }
    }

    jump() {
        if (this.velocityY === 0) {
            this.velocityY = -20;
        }
    }
}