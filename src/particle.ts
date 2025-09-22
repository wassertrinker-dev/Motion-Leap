// in /src/particle.ts

export class Particle {
    x: number;
    y: number;
    size: number;
    markedForDeletion: boolean = false;
    image: HTMLImageElement;
    frameX: number = 0;
    maxFrame: number;
    fps: number = 17;
    frameTimer: number = 0;
    frameInterval: number;

    constructor(x: number, y: number, imageSrc: string, frameCount: number, size: number) {
        this.size = size;
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        
        this.image = new Image();
        this.image.src = imageSrc;
        this.maxFrame = frameCount;

        // BERECHNE frameInterval IM CONSTRUCTOR
        this.frameInterval = 1000 / this.fps;
    }

   update(deltaTime: number) {
    this.frameTimer += deltaTime;

    if (this.frameTimer > this.frameInterval) {
        this.frameTimer = 0; // Timer sofort zurücksetzen

        // Prüfen, ob wir noch Frames übrig haben zum Anzeigen
        if (this.frameX < this.maxFrame - 1) {
            this.frameX++;
        } else {
            // Wenn der letzte Frame erreicht wurde, markieren
            this.markedForDeletion = true;
        }
    }
}

    draw(context: CanvasRenderingContext2D) {
        if (!this.image.complete || this.image.naturalHeight === 0) return; // Sicherheitsabfrage

        const frameWidth =  this.image.width / this.maxFrame;
        const frameHeight = this.image.height;

        context.drawImage(
            this.image,
            this.frameX * frameWidth,
            0,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.size,
            this.size
        );
    }
}