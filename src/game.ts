import { Player } from './player.js'; // HIER gehört der Import hin

class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    gameWidth: number;
    gameHeight: number;

    constructor() {
       this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        // ÄNDERUNG: Wir benutzen nicht mehr die Fenstergröße, sondern feste Werte.
        this.gameWidth = 800;
        this.gameHeight = 600;

        // Diese Zeilen weisen dem Canvas-Element die feste Größe zu.
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;

        this.player = new Player(this.gameWidth, this.gameHeight);

        // Der Event Listener für den Sprung kann erstmal weg, wenn du willst, oder drin bleiben.
        // window.addEventListener('keydown', ... );

        this.gameLoop = this.gameLoop.bind(this);
        this.gameLoop();
    }

    update() {
        this.player.update();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.player.draw(this.ctx);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
}

window.onload = () => {
    new Game();
};