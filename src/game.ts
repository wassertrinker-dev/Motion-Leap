// in /src/game.ts

import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { themes, GameTheme } from './themes.js';

declare const poseDetection: any;
declare const tf: any;

export class Game {
    // Canvas & Rendering
    canvas!: HTMLCanvasElement; // Das ! sagt TypeScript: "Keine Sorge, das wird in init() initialisiert"
    ctx!: CanvasRenderingContext2D;

    // Spiel-Dimensionen
    gameWidth!: number;
    gameHeight!: number;
    
    // HTML-Elemente
    startButton!: HTMLButtonElement;
    video!: HTMLVideoElement;
    logElement!: HTMLElement;
    themeSelectionContainer!: HTMLElement;

    // Spiel-Objekte
    player: Player | null = null;
    enemies: Enemy[];

    // Spielzustand & Timing
    lives!: number;
    isGameOver!: boolean;
    selectedTheme: GameTheme | null = null;
    enemyTimer!: number;
    enemyInterval!: number;
    lastTime: number = 0;
    prevTime: number = 0;

    // Pose Detection & Logging...
    poseDetector: any;
    lastShoulderY: number | null = null;
    JUMP_SENSITIVITY: number = 10;
    lastJumpMovement: number = 0;
    
    constructor() {
        this.enemies = []; // Diese können wir hier schon initialisieren
        window.onload = () => this.init();
    }

    init() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.startButton = document.getElementById('startButton') as HTMLButtonElement;
        this.video = document.getElementById('videoFeed') as HTMLVideoElement;
        this.logElement = document.getElementById('log-output')!;
        this.themeSelectionContainer = document.getElementById('theme-selection')!;
        
        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        // Initialisiere den Rest hier
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.lives = 0;
        this.isGameOver = false;

        this.startGame = this.startGame.bind(this);

        this.setupThemeSelection();
        this.startButton.addEventListener('click', this.startGame);
    }

    setupThemeSelection() {
        document.querySelectorAll('.theme-choice').forEach(card => {
            card.addEventListener('click', (event) => {
                const themeName = (event.currentTarget as HTMLElement).dataset.theme;
                if (themeName && themes[themeName]) {
                    this.selectedTheme = themes[themeName];
                    document.body.style.backgroundColor = this.selectedTheme.backgroundColor;
                    this.themeSelectionContainer.style.display = 'none';
                    this.startButton.style.display = 'block';
                    this.player = new Player(this.gameWidth, this.gameHeight, this.selectedTheme.playerImageSrc);
                }
            });
        });
    }

    // HIER SIND DIE FEHLENDEN METHODEN
    async startGame() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;
            await new Promise((resolve) => { this.video.onloadedmetadata = resolve; });
            
            await this.setupPoseDetection();

            this.canvas.style.display = 'block';
            
            this.lives = 3;
            this.isGameOver = false;
            this.enemies = [];
            this.enemyTimer = 0;

            if (this.player) {
                this.player.y = 0;
                this.player.velocityY = 0;
            }
            
            this.gameLoop(0);
        } catch (error) {
            console.error('Fehler beim Starten des Spiels oder der Kamera:', error);
            alert('Ohne Kamerazugriff kann das Spiel nicht gestartet werden.');
        }
    }
    
    async setupPoseDetection() {
        await tf.ready();
        const model = poseDetection.SupportedModels.MoveNet;
        this.poseDetector = await poseDetection.createDetector(model);
        console.log('Posen-Modell geladen.');
    }

    async detectJump() {
        if (!this.poseDetector || this.video.paused || this.video.ended) return;
        const poses = await this.poseDetector.estimatePoses(this.video);
        if (poses && poses.length > 0 && this.player) {
            const keypoints = poses[0].keypoints;
            const leftShoulder = keypoints.find(p => p.name === 'left_shoulder');
            const rightShoulder = keypoints.find(p => p.name === 'right_shoulder');
            if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
                const currentShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
                if (this.lastShoulderY !== null) {
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

    addEnemy() {
        if (this.selectedTheme) {
            this.enemies.push(new Enemy(this.gameWidth, this.gameHeight, this.selectedTheme.enemyImageSrc));
        }
    }

    update(deltaTime: number) {
        if (this.isGameOver || !this.player) return;
        this.player.update(this.gameHeight);
        
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(enemy => enemy.update());
        this.enemies.forEach((enemy, index) => {
            if (this.player &&
                this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                
                this.enemies.splice(index, 1);
                this.lives--;
                if (this.lives <= 0) {
                    this.isGameOver = true;
                }
            }
        });
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.drawImage(this.video, 0, 0, this.gameWidth, this.gameHeight);
        
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.drawUI();
    }

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

    updateLog() {
        if (!this.player) return;
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

// Erstellt die Instanz sofort, aber der wichtige Code läuft erst in `init()` nach window.onload.
new Game();