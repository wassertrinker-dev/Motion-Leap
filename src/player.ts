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
        this.y = 0;
        this.color = 'red';
        this.velocityY = 0;
        this.gravity = 0.5;
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(gameHeight: number) { // HIER nehmen wir den Wert an
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    // Überprüfe, ob der Spieler den Boden berührt
    if (this.y + this.height > gameHeight) {
        // Setze die Position genau auf den Boden
        this.y = gameHeight - this.height;
        // Stoppe die Fallbewegung
        this.velocityY = 0;
    } 
}
    jump() {
        // Wir erlauben einen Sprung nur, wenn der Spieler am Boden ist.
        // Ein Indikator dafür ist, dass seine vertikale Geschwindigkeit 0 ist.
    if (this.velocityY === 0) {
        this.velocityY = -20; // Das ist die Sprunghöhe. Ein negativer Wert bedeutet "nach oben".
                                  // Spiel mit diesem Wert, um die Sprunghöhe anzupassen!
    }
}
}