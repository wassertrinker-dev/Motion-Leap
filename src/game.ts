// in /src/game.ts

import { Player } from './player.js';
import { Enemy } from './enemy.js';

// Deklariert globale Variablen, die von externen Skripten (TensorFlow.js) geladen werden,
// damit TypeScript ihre Existenz kennt und keine Fehler meldet.
declare const poseDetection: any;
declare const tf: any;

/**
 * Die Hauptklasse, die das gesamte Spiel orchestriert.
 * Sie verwaltet die Spiel-Schleife, den Spielzustand (Leben, Game Over),
 * den Spieler, die Gegner, das Rendering auf der Canvas und die Kamera-Eingabe.
 */
export class Game {
    // Canvas & Rendering
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Spiel-Dimensionen
    gameWidth: number;
    gameHeight: number;
    
    // HTML-Elemente
    startButton: HTMLButtonElement;
    video: HTMLVideoElement;

    // Spiel-Objekte
    player: Player;
    enemies: Enemy[];

    // Spielzustand & Timing
    lives: number;
    isGameOver: boolean;
    enemyTimer: number;
    enemyInterval: number;
    lastTime: number = 0;
    prevTime: number = 0;

    // Pose Detection
    poseDetector: any;
    lastShoulderY: number | null = null;
    JUMP_SENSITIVITY: number = 10;

    // Debugging & Logging
    logElement: HTMLElement;
    lastJumpMovement: number = 0;
    
    /**
     * Erstellt die Haupt-Spielinstanz.
     * Initialisiert Eigenschaften, holt notwendige HTML-Elemente aus dem DOM
     * und richtet den Event-Listener für den Start-Button ein.
     */
    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.startButton = document.getElementById('startButton') as HTMLButtonElement;
        this.video = document.getElementById('videoFeed') as HTMLVideoElement;
        this.logElement = document.getElementById('log-output')!;

        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        this.player = new Player(this.gameWidth, this.gameHeight);
        
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 2000; // Gegner erscheint alle 2 Sekunden
        this.lives = 0;
        this.isGameOver = false;

        this.startGame = this.startGame.bind(this);
        this.startButton.addEventListener('click', this.startGame);
        
        this.setupInput();
    }
    
    /** Initialisiert Event-Listener für Benutzereingaben. Derzeit leer, da die Steuerung über die Kamera erfolgt. */
    setupInput() {}

    /**
     * Behandelt den asynchronen Startprozess des Spiels.
     * Fordert Kamerazugriff an, lädt das KI-Modell, setzt den Spielzustand zurück und startet die Spiel-Schleife.
     * Fängt Fehler ab, falls der Nutzer den Kamerazugriff verweigert.
     */
    async startGame() {
        try {
            // 1. Kamera anfordern und in das Video-Element leiten
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;
            await new Promise((resolve) => { this.video.onloadedmetadata = resolve; });
            
            // 2. KI-Modell für die Posenerkennung laden
            await this.setupPoseDetection();

            // 3. Spielzustand zurücksetzen und UI anpassen
            this.startButton.style.display = 'none';
            this.canvas.style.display = 'block';
            this.lives = 3;
            this.isGameOver = false;
            this.enemies = [];
            this.enemyTimer = 0;
            this.player.y = 0;
            this.player.velocityY = 0;
            
            // 4. Spiel-Schleife starten
            this.gameLoop(0);

        } catch (error) {
            console.error('Fehler beim Starten des Spiels oder der Kamera:', error);
            alert('Ohne Kamerazugriff kann das Spiel nicht gestartet werden.');
        }
    }
    
    /**
     * Lädt und konfiguriert das MoveNet-Modell von TensorFlow.js für die Echtzeit-Posenerkennung.
     */
    async setupPoseDetection() {
        await tf.ready();
        const model = poseDetection.SupportedModels.MoveNet;
        this.poseDetector = await poseDetection.createDetector(model);
        console.log('Posen-Modell geladen.');
    }

    /**
     * Analysiert in jedem Frame das Kamerabild, um eine Sprungbewegung zu erkennen.
     * Eine schnelle Aufwärtsbewegung der Schultern löst die `jump()`-Methode des Spielers aus.
     */
    async detectJump() {
        if (!this.poseDetector || this.video.paused || this.video.ended) return;

        const poses = await this.poseDetector.estimatePoses(this.video);

        if (poses && poses.length > 0) {
            const keypoints = poses[0].keypoints;
            const leftShoulder = keypoints.find(p => p.name === 'left_shoulder');
            const rightShoulder = keypoints.find(p => p.name === 'right_shoulder');

            if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
                const currentShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

                if (this.lastShoulderY !== null) {
                    // Eine positive Bewegung bedeutet "nach oben", da Y=0 am oberen Rand ist.
                    const movement = this.lastShoulderY - currentShoulderY;
                    this.lastJumpMovement = movement;
                    
                    if (movement > this.JUMP_SENSITIVITY) {
                        this.player.jump();
                    }
                }
                this.lastShoulderY = currentShoulderY;
            }
        }
    }

    /** Erstellt eine neue Gegner-Instanz und fügt sie dem Spiel hinzu. */
    addEnemy() {
        this.enemies.push(new Enemy(this.gameWidth, this.gameHeight));
    }

    /**
     * Aktualisiert den gesamten Spielzustand für den nächsten Frame.
     * @param deltaTime Die Zeit in Millisekunden seit dem letzten Frame. Wichtig für flüssige, hardware-unabhängige Animationen und Timer.
     */
    update(deltaTime: number) {
        if (this.isGameOver) return; // Friert das Spiel ein, wenn es vorbei ist.

        this.player.update(this.gameHeight);
        
        // Gegner-Timer Logik
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        
        // Alle Gegner bewegen
        this.enemies.forEach(enemy => enemy.update());

        // Kollisionserkennung
        this.enemies.forEach((enemy, index) => {
            if (this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                
                this.enemies.splice(index, 1); // Getroffenen Gegner entfernen
                this.lives--;
                if (this.lives <= 0) {
                    this.isGameOver = true;
                }
            }
        });
        
        // Gegner entfernen, die den Bildschirm verlassen haben
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
    }

    /**
     * Zeichnet den gesamten Spielzustand auf die Canvas.
     * Die Zeichenreihenfolge ist wichtig: Hintergrund zuerst, dann Objekte, dann UI.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.drawImage(this.video, 0, 0, this.gameWidth, this.gameHeight); // Hintergrund
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.drawUI();
    }

    /** Zeichnet die Benutzeroberfläche (Leben, Game-Over-Text) über das Spielgeschehen. */
    drawUI() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Leben: ${this.lives}`, 20, 40);

        if (this.isGameOver) {
            this.ctx.textAlign = 'center';
            this.ctx.font = '60px Arial';
            this.ctx.fillText('Game Over', this.gameWidth / 2, this.gameHeight / 2);
        }
    }

    /** Aktualisiert den Inhalt des Debug-Log-Fensters mit Echtzeit-Daten aus dem Spiel. */
    updateLog() {
        const fps = (1000 / (this.lastTime - this.prevTime)).toFixed(1);
        const logText = `
-- JUMP DETECTION --
Movement:       ${this.lastJumpMovement.toFixed(2)}
Sensitivity:    ${this.JUMP_SENSITIVITY}
-- PLAYER STATE --
Y Position:     ${this.player.y.toFixed(2)}
Y Velocity:     ${this.player.velocityY.toFixed(2)}
-- GAME STATE --
Lives:          ${this.lives}
Enemies:        ${this.enemies.length}
Game Over:      ${this.isGameOver}
FPS:            ${fps}
        `;
        this.logElement.innerText = logText;
    }

    /**
     * Die zentrale Spiel-Schleife.
     * Wird von `requestAnimationFrame` ca. 60 Mal pro Sekunde aufgerufen.
     * Berechnet die `deltaTime` und ruft alle Update-, Draw- und Log-Funktionen auf.
     * @param timestamp Ein hochpräziser Zeitstempel, der vom Browser bereitgestellt wird.
     */
    gameLoop(timestamp: number) {
        this.prevTime = this.lastTime;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.detectJump();
        this.update(deltaTime);
        this.draw();
        this.updateLog();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Startet den Prozess, indem eine neue Game-Instanz erstellt wird, sobald die Seite geladen ist.
window.onload = () => {
    new Game();
};