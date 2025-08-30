// in /src/game.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Player } from './player.js';
import { Enemy } from './enemy.js';
class Game {
    constructor() {
        this.lastTime = 0;
        this.prevTime = 0;
        this.lastShoulderY = null;
        this.JUMP_SENSITIVITY = 10;
        this.lastJumpMovement = 0; // Speichert den letzten Bewegungswert für die Anzeige
        // Dieser Code ist korrekt und greift auf die oben deklarierten Eigenschaften zu
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById('startButton');
        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.player = new Player(this.gameWidth, this.gameHeight);
        this.video = document.getElementById('videoFeed');
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.lives = 0;
        this.isGameOver = false;
        this.startGame = this.startGame.bind(this);
        this.startButton.addEventListener('click', this.startGame);
        this.logElement = document.getElementById('log-output');
        this.setupInput();
    }
    setupInput() {
        // Ist jetzt leer, wir steuern nicht mehr per Tastatur
    }
    startGame() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stream = yield navigator.mediaDevices.getUserMedia({ video: true });
                this.video.srcObject = stream;
                yield new Promise((resolve) => { this.video.onloadedmetadata = resolve; });
                yield this.setupPoseDetection();
                this.startButton.style.display = 'none';
                this.canvas.style.display = 'block';
                this.lives = 3000000;
                this.isGameOver = false;
                this.enemies = [];
                this.enemyTimer = 0;
                this.player.y = 0;
                this.player.velocityY = 0;
                this.gameLoop(0);
            }
            catch (error) {
                console.error('Fehler beim Starten des Spiels oder der Kamera:', error);
                alert('Ohne Kamerazugriff kann das Spiel nicht gestartet werden.');
            }
        });
    }
    setupPoseDetection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield tf.ready();
            const model = poseDetection.SupportedModels.MoveNet;
            this.poseDetector = yield poseDetection.createDetector(model);
            console.log('Posen-Modell geladen.');
        });
    }
    detectJump() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poseDetector)
                return;
            const poses = yield this.poseDetector.estimatePoses(this.video);
            if (poses && poses.length > 0) {
                const keypoints = poses[0].keypoints;
                const leftShoulder = keypoints.find(p => p.name === 'left_shoulder');
                const rightShoulder = keypoints.find(p => p.name === 'right_shoulder');
                if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
                    const currentShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
                    if (this.lastShoulderY !== null) {
                        const movement = this.lastShoulderY - currentShoulderY;
                        this.lastJumpMovement = movement;
                        if (movement > this.JUMP_SENSITIVITY) {
                            console.log('Sprung erkannt!');
                            this.player.jump();
                        }
                    }
                    this.lastShoulderY = currentShoulderY;
                }
            }
        });
    }
    addEnemy() {
        this.enemies.push(new Enemy(this.gameWidth, this.gameHeight));
    }
    update(deltaTime) {
        if (this.isGameOver)
            return;
        this.player.update(this.gameHeight);
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        }
        else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(enemy => {
            enemy.update();
        });
        this.enemies.forEach((enemy, index) => {
            if (this.player.x < enemy.x + enemy.width &&
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
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        this.drawUI();
    }
    drawUI() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`Leben: ${this.lives}`, 20, 40);
        if (this.isGameOver) {
            this.ctx.textAlign = 'center';
            this.ctx.font = '60px Arial';
            this.ctx.fillText('Game Over', this.gameWidth / 2, this.gameHeight / 2);
        }
    }
    updateLog() {
        const fps = (1000 / (this.lastTime - (this.prevTime || this.lastTime))).toFixed(1);
        console.log("updateLog wird aufgerufen!");
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
        console.log(logText);
        // Schreibe den formatierten Text in das HTML-Element
        this.logElement.innerText = logText;
    }
    gameLoop(timestamp) {
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
window.onload = () => {
    new Game();
};
