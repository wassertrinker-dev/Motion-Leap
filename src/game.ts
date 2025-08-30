import { Player } from './player.js'; 
import { Enemy } from './enemy.js';


class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    gameWidth: number;
    gameHeight: number;

    startButton: HTMLButtonElement;

    enemies: Enemy[];       // Ein "Container" (Array) für alle Gegner
    enemyTimer: number;     // Ein Zähler, der hochzählt
    enemyInterval: number;  // Die Zeit, nach der ein neuer Gegner erscheint

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        // NEU: Den Start-Button aus dem HTML holen
        this.startButton = document.getElementById('startButton') as HTMLButtonElement;

        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;

        this.player = new Player(this.gameWidth, this.gameHeight);

        this.enemies = []; // Startet als leere Liste
        this.enemyTimer = 0; // Der Zähler startet bei 0
        this.enemyInterval = 2000; // 2000ms = 2 Sekunden

        // Wir binden die startGame Methode, damit 'this' korrekt funktioniert
        this.startGame = this.startGame.bind(this);
        // Wir fügen den Event Listener zum Button hinzu
        this.startButton.addEventListener('click', this.startGame);
        this.setupInput();
    }

    setupInput() {
        window.addEventListener('keydown', (event) => {
            // Wir prüfen, ob die gedrückte Taste die Leertaste ist
            if (event.code === 'Space') {
                this.player.jump();
            }
        });
    }


    startGame() {
        // Verstecke den Button
        this.startButton.style.display = 'none';
        // Zeige die Canvas an
        this.canvas.style.display = 'block';
        
        // Starte die Spiel-Schleife
        this.gameLoop(0);
    }
    
     update(deltaTime: number) { // <<-- NIMMT JETZT 'deltaTime' AN
        this.player.update(this.gameHeight);
         // 1. Gegner erzeugen, wenn die Zeit abgelaufen ist
        if (this.enemyTimer > this.enemyInterval) {
            this.enemies.push(new Enemy(this.gameWidth, this.gameHeight));
            this.enemyTimer = 0; // Timer zurücksetzen
        } else {
            this.enemyTimer += deltaTime; // Zeit seit letztem Frame aufaddieren
        }
        
        // 2. Alle Gegner, die in unserem Array sind, bewegen
        this.enemies.forEach(enemy => {
            enemy.update();
        });
        
        // 3. Alle Gegner aus dem Array entfernen, die links aus dem Bild sind
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
       
    }

    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.player.draw(this.ctx);
        
         // Malt jeden Gegner, der sich aktuell im 'enemies'-Array befindet
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
    }

    lastTime: number = 0;
    gameLoop(timestamp: number) { // <<-- NIMMT JETZT 'timestamp' AN
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime); // <<-- WIR GEBEN 'deltaTime' AN UPDATE WEITER
        this.draw();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

window.onload = () => {
    new Game();
};