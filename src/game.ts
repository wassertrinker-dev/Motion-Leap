import { Player } from './player.js'; 
import { Enemy } from './enemy.js';


class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    gameWidth: number;
    gameHeight: number;

    startButton: HTMLButtonElement;

    video: HTMLVideoElement;

    enemies: Enemy[];       // Ein "Container" (Array) für alle Gegner
    enemyTimer: number;     // Ein Zähler, der hochzählt
    enemyInterval: number;  // Die Zeit, nach der ein neuer Gegner erscheint

    lives: number;
    isGameOver: boolean; 

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        // NEU: Den Start-Button aus dem HTML holen
        this.startButton = document.getElementById('startButton') as HTMLButtonElement;

        this.video = document.getElementById('videoFeed') as HTMLVideoElement;

        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;

        this.player = new Player(this.gameWidth, this.gameHeight);

        this.enemies = []; // Startet als leere Liste
        this.enemyTimer = 0; // Der Zähler startet bei 0
        this.enemyInterval = 2000; // 2000ms = 2 Sekunden

        this.lives = 0;
        this.isGameOver = false;

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


    async startGame() {
        try {
            // NEU: Fordere den Kamerazugriff an
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;

            // Erst wenn der Zugriff erfolgreich war, starte das Spiel
            this.startButton.style.display = 'none';
            this.canvas.style.display = 'block';
            
            this.lives = 3;
            this.isGameOver = false;
            this.enemies = [];
            this.enemyTimer = 0;
            this.player.y = 0;
            this.player.velocityY = 0;
            
            this.gameLoop(0);

        } catch (error) {
            // NEU: Fehlerbehandlung, falls der Nutzer ablehnt oder keine Kamera hat
            console.error('Kamerazugriff verweigert oder fehlgeschlagen:', error);
            alert('Ohne Kamerazugriff kann das Spiel nicht gestartet werden.');
        }
    }
    
     update(deltaTime: number) { // <<-- NIMMT JETZT 'deltaTime' AN
        
        if (this.isGameOver) {
            return; // Stoppt die Ausführung dieser Methode
        }


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
        
        
        this.enemies.forEach((enemy, index) => {
            // AABB-Kollisionserkennung (Axis-Aligned Bounding Box)
            if (
                this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y
            ) {
                // Kollision erkannt!
                this.enemies.splice(index, 1); // Entferne den Gegner, um Mehrfach-Treffer zu vermeiden
                this.lives--; // Reduziere die Leben

                // Prüfe auf Game Over
                if (this.lives <= 0) {
                    this.isGameOver = true;
                }
            }
        });

        // 3. Alle Gegner aus dem Array entfernen, die links aus dem Bild sind
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);


       
    }

    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.drawImage(this.video, 0, 0, this.gameWidth, this.gameHeight);
        
        this.player.draw(this.ctx);

         // Malt jeden Gegner, der sich aktuell im 'enemies'-Array befindet
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });

         this.drawUI();
    }

    drawUI() {
        // Lebensanzeige
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Leben: ${this.lives}`, 20, 40);

        // Game-Over-Anzeige
        if (this.isGameOver) {
            this.ctx.textAlign = 'center';
            this.ctx.font = '60px Arial';
            this.ctx.fillText('Game Over', this.gameWidth / 2, this.gameHeight / 2);
        }
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