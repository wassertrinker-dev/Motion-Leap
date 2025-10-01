// in /src/game.ts (VOLLSTÄNDIGE & KORREKTE VERSION)
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
import { themes } from './themes.js';
import { Particle } from './particle.js';
import { Background } from './background.js';
/**
 * Die Hauptklasse, die das gesamte Spiel orchestriert.
 * Verwaltet die Spiel-Schleife, den Zustand, alle Spielobjekte, das Rendering und die Kamera-Eingabe.
 */
export class Game {
    /**
     * Erstellt eine neue Instanz des Spiels.
     * Der Konstruktor initialisiert die Objekt-Arrays und registriert die `init()`-Methode,
     * die nach dem vollständigen Laden der Seite aufgerufen wird.
     */
    constructor() {
        // --- Spiel-Objekte ---
        /** Die Spielerinstanz. Null, bis ein Thema gewählt wurde. */
        this.player = null;
        /** Die Instanz für den scrollenden Parallax-Hintergrund. */
        this.background = null;
        /** Das aktuell vom Spieler ausgewählte visuelle Thema. */
        this.selectedTheme = null;
        /** Der Zeitstempel des letzten Frames der Spiel-Schleife. */
        this.lastTime = 0;
        /** Der Zeitstempel des vorletzten Frames, zur FPS-Berechnung. */
        this.prevTime = 0;
        /** Die Dauer eines Levels in Sekunden. */
        this.levelTime = 15; // 60 
        /** animation FrameID um gameloop exact zu beneden (bug= gegner zu schnell nachrestart) */
        this.animationFrameId = 0; // <-- DIESE ZEILE HINZUFÜGEN
        /** Die verbleibende Zeit im aktuellen Level in Sekunden. */
        this.timeRemaining = 0;
        /** Die durchschnittliche Y-Position der Schultern aus dem letzten Frame. */
        this.lastShoulderY = null;
        /** Die Empfindlichkeit für die Sprungerkennung. Ein höherer Wert erfordert eine schnellere Bewegung. */
        this.JUMP_SENSITIVITY = 10;
        // --- Effekte & Logging ---
        /** Die zuletzt erkannte vertikale Bewegung der Schultern (für Debug-Zwecke). */
        this.lastJumpMovement = 0;
        /** Die verbleibende Dauer des Screen-Shake-Effekts in Millisekunden. */
        this.shakeDuration = 0;
        /** Die Stärke des Screen-Shake-Effekts in Pixeln. */
        this.shakeMagnitude = 5;
        this.enemies = [];
        this.particles = [];
        window.onload = () => this.init();
    }
    /**
     * Initialisiert das Spiel, nachdem die HTML-Seite vollständig geladen ist.
     * Holt alle notwendigen HTML-Elemente, setzt die Spiel-Dimensionen
     * und richtet die initialen Event-Listener ein.
     * @returns {void}
     */
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById('startButton');
        this.video = document.getElementById('videoFeed');
        this.logElement = document.getElementById('log-output');
        this.themeSelectionContainer = document.getElementById('theme-selection');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.progressBar = document.getElementById('progress-bar');
        this.progressText = document.getElementById('progress-text');
        this.endScreenOverlay = document.getElementById('end-screen-overlay');
        this.winVideo = document.getElementById('win-video');
        const restartButton = document.getElementById('restart-button');
        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.isGameOver = false;
        this.startGame = this.startGame.bind(this);
        this.setupThemeSelection();
        this.startButton.addEventListener('click', this.startGame);
        // Die einzige logische Änderung: Den Neustart-Button funktionsfähig machen.
        restartButton.addEventListener('click', this.startGame);
    }
    /**
     * Richtet die Klick-Events für die Themenauswahl-Karten ein.
     * Bei Auswahl eines Themas wird der Spieler erstellt und der Start-Button angezeigt.
     * @returns {void}
     */
    setupThemeSelection() {
        document.querySelectorAll('.theme-choice').forEach(card => {
            card.addEventListener('click', (event) => {
                const themeName = event.currentTarget.dataset.theme;
                if (themeName && themes[themeName]) {
                    this.selectedTheme = themes[themeName];
                    document.body.style.backgroundColor = this.selectedTheme.backgroundColor;
                    this.themeSelectionContainer.style.display = 'none';
                    this.startButton.style.display = 'block';
                    this.background = new Background(this.gameWidth, this.gameHeight, this.selectedTheme.backgroundImageSrc, 1);
                    this.player = new Player(this.gameWidth, this.gameHeight, this.selectedTheme.playerAnimations);
                }
            });
        });
    }
    /**
     * Startet den asynchronen Spielprozess.
     * Kümmert sich um Kamerazugriff, Laden der KI-Modelle und Zurücksetzen des Spielzustands.
     * @async
     * @returns {Promise<void>}
     */
    startGame() {
        return __awaiter(this, void 0, void 0, function* () {
            //Stoppt eine eventuell noch laufende, alte Spiel-Schleife.
            cancelAnimationFrame(this.animationFrameId);
            if (this.endScreenOverlay) {
                this.endScreenOverlay.style.display = 'none';
            }
            this.loadingOverlay.style.display = 'flex';
            this.progressBar.style.width = '0%';
            this.progressText.innerText = '0%';
            try {
                const stream = yield navigator.mediaDevices.getUserMedia({ video: true });
                this.video.srcObject = stream;
                yield new Promise((resolve) => { this.video.onloadedmetadata = resolve; });
                yield this.setupPoseDetection();
                this.canvas.style.display = 'block';
                this.startButton.style.display = 'none';
                this.score = 0;
                this.timeRemaining = this.levelTime;
                this.isGameOver = false;
                this.enemies = [];
                this.enemyTimer = 0;
                if (this.player) {
                    // Zurück zum Original-Code
                    this.player.y = 0;
                    this.player.velocityY = 0;
                }
                this.gameLoop(0);
            }
            catch (error) {
                console.error('Fehler beim Starten des Spiels oder der Kamera:', error);
                alert('Ohne Kamerazugriff kann das Spiel nicht gestartet werden.');
            }
            finally {
                this.loadingOverlay.style.display = 'none';
            }
        });
    }
    /**
     * Lädt und konfiguriert das MoveNet-Modell für die Posenerkennung.
     * Aktualisiert den Ladebalken während des Downloads.
     * @async
     * @returns {Promise<void>}
     */
    setupPoseDetection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield tf.ready();
            const model = poseDetection.SupportedModels.MoveNet;
            this.poseDetector = yield poseDetection.createDetector(model, {
                onProgress: (fraction) => {
                    const percent = Math.floor(fraction * 100);
                    this.progressBar.style.width = `${percent}%`;
                    this.progressText.innerText = `${percent}%`;
                }
            });
            console.log('Posen-Modell geladen.');
        });
    }
    /**
     * Analysiert das aktuelle Kamerabild, um eine Sprungbewegung der Schultern zu erkennen.
     * Wenn eine schnelle Aufwärtsbewegung erkannt wird, wird die `jump()`-Methode des Spielers aufgerufen.
     * @async
     * @returns {Promise<void>}
     */
    detectJump() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poseDetector || this.video.paused || this.video.ended || !this.player)
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
                            this.player.jump();
                        }
                    }
                    this.lastShoulderY = currentShoulderY;
                }
            }
        });
    }
    /**
     * Erstellt einen neuen Gegner basierend auf dem ausgewählten Thema und fügt ihn zum Spiel hinzu.
     * @returns {void}
     */
    addEnemy() {
        if (this.selectedTheme) {
            this.enemies.push(new Enemy(this.gameWidth, this.gameHeight, this.selectedTheme.enemyAsset));
        }
    }
    /**
     * Aktualisiert den gesamten Spielzustand für den nächsten Frame.
     * Beinhaltet Spieler, Gegner, Kollisionen, Timer und Effekte.
     * @param {number} deltaTime - Die Zeit in Millisekunden seit dem letzten Frame.
     * @returns {void}
     */
    update(deltaTime) {
        // console.log('Update aufgerufen!'); // logging for debug
        if (this.background) {
            this.background.update();
        }
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
        }
        if (this.isGameOver) {
            return;
        }
        this.timeRemaining -= deltaTime / 1000;
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.isGameOver = true;
            this.showEndScreen();
            return;
        }
        if (!this.player)
            return;
        // Zurück zum Original-Code
        this.player.update(deltaTime, this.gameHeight);
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        }
        else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach((enemy, index) => {
            // Zurück zum Original-Code
            enemy.update();
            // Zurück zum Original-Code
            if (this.player &&
                this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                const playerBottomLastFrame = this.player.y + this.player.height - this.player.velocityY;
                if (this.player.velocityY > 0 && playerBottomLastFrame <= enemy.y) {
                    this.score += 10;
                    // Zurück zum Original-Code
                    this.player.velocityY = -10;
                    if (this.selectedTheme) {
                        const destruction = this.selectedTheme.enemyAsset.destruction;
                        this.particles.push(new Particle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, destruction.src, destruction.frameCount, destruction.size));
                    }
                    this.enemies.splice(index, 1);
                }
                else {
                    this.enemies.splice(index, 1);
                    this.triggerShake(200);
                }
            }
        });
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
        this.particles.forEach((particle, index) => {
            particle.update(deltaTime);
            if (particle.markedForDeletion) {
                this.particles.splice(index, 1);
            }
        });
    }
    /**
     * Zeigt den "Level geschafft!"-Bildschirm an.
     * @returns {void}
     */
    showEndScreen() {
        if (!this.selectedTheme)
            return;
        this.endScreenOverlay.style.backgroundImage = `url(${this.selectedTheme.backgroundImageSrc})`;
        this.winVideo.src = this.selectedTheme.winVideoSrc;
        this.winVideo.play();
        this.endScreenOverlay.style.display = 'flex';
    }
    /**
     * Zeichnet den gesamten Spielzustand auf die Canvas.
     * Wird in jedem Frame der Spiel-Schleife aufgerufen.
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        if (this.background) {
            this.background.draw(this.ctx);
        }
        this.ctx.save();
        if (this.shakeDuration > 0) {
            const shakeX = (Math.random() - 0.5) * 2 * this.shakeMagnitude;
            const shakeY = (Math.random() - 0.5) * 2 * this.shakeMagnitude;
            this.ctx.translate(shakeX, shakeY);
        }
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(this.video, 0, 0, this.gameWidth, this.gameHeight);
        this.ctx.restore();
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
        if (this.player) {
            this.player.draw(this.ctx);
        }
        this.ctx.restore();
        this.drawUI();
    }
    /**
     * Zeichnet die Benutzeroberfläche (Zeit, Score) über das Spielgeschehen.
     * @returns {void}
     */
    drawUI() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'left';
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = Math.floor(this.timeRemaining % 60);
        this.ctx.fillText(`Zeit: ${minutes}:${seconds.toString().padStart(2, '0')}`, 20, 40);
        this.ctx.fillText(`Score: ${this.score}`, 20, 80);
    }
    /**
     * Aktualisiert den Inhalt des Debug-Log-Fensters mit Echtzeit-Daten.
     * @returns {void}
     */
    updateLog() {
        if (!this.player)
            return;
        const fps = (1000 / (this.lastTime - this.prevTime)).toFixed(1);
        let particleInfo = '-- PARTICLES --\n';
        if (this.particles.length > 0) {
            const firstParticle = this.particles[0];
            particleInfo += `Count:          ${this.particles.length}\n`;
            particleInfo += `Frame:          ${firstParticle.frameX} / ${firstParticle.maxFrame - 1}\n`;
            particleInfo += `Timer:          ${firstParticle.frameTimer.toFixed(0)} / ${firstParticle.frameInterval.toFixed(0)}\n`;
        }
        else {
            particleInfo += 'Count:          0';
        }
        const logText = `
-- JUMP DETECTION --
Movement:       ${this.lastJumpMovement.toFixed(2)}
Sensitivity:    ${this.JUMP_SENSITIVITY}
-- PLAYER STATE --
State:          ${this.player.currentState}
Y Position:     ${this.player.y.toFixed(2)}
Y Velocity:     ${this.player.velocityY.toFixed(2)}
-- PARTICLE -- 
${particleInfo}
-- ANIMATION --
Frame:          ${this.player.frameX} / ${this.player.maxFrame - 1}
-- GAME STATE --
Enemies:        ${this.enemies.length}
Game Over:      ${this.isGameOver}
FPS:            ${fps}
        `;
        this.logElement.innerText = logText;
    }
    /**
     * Die zentrale Spiel-Schleife, die mit `requestAnimationFrame` läuft.
     * @param {number} timestamp - Ein hochpräziser Zeitstempel, der vom Browser bereitgestellt wird.
     * @returns {void}
     */
    gameLoop(timestamp) {
        this.prevTime = this.lastTime;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.detectJump();
        this.update(deltaTime || 0);
        this.draw();
        this.updateLog();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this)); // speichern der FrameID
    }
    /**
     * Löst einen Screen-Shake-Effekt aus.
     * @param {number} duration - Die Dauer des Effekts in Millisekunden.
     * @returns {void}
     */
    triggerShake(duration) {
        this.shakeDuration = duration;
    }
}
// Erstellt die zentrale Spiel-Instanz, die das gesamte Spiel steuert.
new Game();
