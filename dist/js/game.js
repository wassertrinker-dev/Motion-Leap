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
import { themes } from './themes.js';
import { Particle } from './particle.js';
import { Background } from './background.js';
/**
 * Die Hauptklasse, die das gesamte Spiel orchestriert.
 * Verwaltet die Spiel-Schleife, den Zustand, alle Spielobjekte, das Rendering und die Kamera-Eingabe.
 */
export class Game {
    /**
     * Erstellt die Haupt-Spielinstanz.
     * Der Constructor ist schlank und delegiert die Initialisierung an die `init()`-Methode,
     * die erst nach dem vollständigen Laden der Seite aufgerufen wird.
     */
    constructor() {
        // --- EIGENSCHAFTEN ---
        this.background = null; // NEU: Eigenschaft für den Hintergrund
        // Spiel-Objekte
        this.player = null;
        this.particles = []; // NEU
        this.selectedTheme = null;
        this.lastTime = 0;
        this.prevTime = 0;
        this.lastShoulderY = null;
        this.JUMP_SENSITIVITY = 10;
        // Logging
        this.lastJumpMovement = 0;
        // NEU: Eigenschaften für den Timer
        this.levelTime = 18; // Level-Dauer in Sekunden (z.B. 3 Minuten)
        this.timeRemaining = 0;
        //  Eigenschaften für den Screen Shake
        this.shakeDuration = 0; // Wie lange der Shake noch andauert (in ms)
        this.shakeMagnitude = 5; // Wie stark die Verschiebung ist (in Pixel)
        this.enemies = [];
        window.onload = () => this.init();
    }
    /**
     * Initialisiert das Spiel, nachdem die HTML-Seite vollständig geladen ist.
     * Holt alle HTML-Elemente, setzt Dimensionen und richtet Event-Listener ein.
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
        // Die Buttons holen wir auch, auch wenn sie noch keine Funktion haben
        const restartButton = document.getElementById('restart-button');
        const nextLevelButton = document.getElementById('next-level-button');
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
    }
    /**
     * Richtet die Event-Listener für die klickbaren Themen-Karten ein.
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
     * Behandelt den asynchronen Startprozess des Spiels nach dem Klick auf "Start".
     * Zeigt den Ladebildschirm an, fordert Kamerazugriff an, lädt KI-Modelle und startet die Spiel-Schleife.
     */
    startGame() {
        return __awaiter(this, void 0, void 0, function* () {
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
                this.timeRemaining = this.levelTime; // Setze den Timer auf die Startzeit
                this.isGameOver = false;
                this.enemies = [];
                this.enemyTimer = 0;
                if (this.player) {
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
     * Aktualisiert dabei den Ladebalken.
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
     * Analysiert das Kamerabild in jedem Frame, um eine Sprungbewegung zu erkennen.
     */
    detectJump() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poseDetector || this.video.paused || this.video.ended)
                return;
            const poses = yield this.poseDetector.estimatePoses(this.video);
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
        });
    }
    /** Erstellt eine neue Gegner-Instanz basierend auf dem gewählten Thema. */
    addEnemy() {
        if (this.selectedTheme) {
            // Wir übergeben jetzt das GANZE asset-Objekt, nicht mehr nur den Bild-Pfad.
            this.enemies.push(new Enemy(this.gameWidth, this.gameHeight, this.selectedTheme.enemyAsset));
        }
    }
    /**
     * Aktualisiert den gesamten Spielzustand für den nächsten Frame.
     * @param deltaTime Die Zeit in Millisekunden seit dem letzten Frame.
     */
    update(deltaTime) {
        if (this.background) {
            this.background.update();
        }
        // NEU: Shake-Timer herunterzählen
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
        }
        // GEÄNDERT: Stoppt die Spiellogik, wenn das Level vorbei ist.
        if (this.isGameOver) {
            return;
        }
        // NEU: Timer für das Level herunterzählen
        this.timeRemaining -= deltaTime / 1000; // Teile durch 1000 für Sekunden
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.isGameOver = true; // Stoppt das Spiel, wenn die Zeit abgelaufen ist
            this.showEndScreen();
        }
        // if (this.isGameOver || !this.player) return;
        if (!this.player)
            return;
        this.player.update(deltaTime, this.gameHeight);
        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        }
        else {
            this.enemyTimer += deltaTime;
        }
        this.enemies.forEach(enemy => enemy.update());
        this.enemies.forEach((enemy, index) => {
            if (this.player &&
                this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                // Bedingung für einen "Stomp" (Sprung von oben):
                // 1. Der Spieler muss sich nach unten bewegen (fallen).
                // 2. Die UNTERKANTE des Spielers im LETZTEN Frame muss ÜBER der OBERKANTE des Gegners gewesen sein.
                const playerBottomLastFrame = this.player.y + this.player.height - this.player.velocityY;
                if (this.player.velocityY > 0 && playerBottomLastFrame <= enemy.y) {
                    // --- ERFOLGREICHER SPRUNG AUF DEN GEGNER ---
                    this.score += 10; // Gib dem Spieler Punkte
                    this.player.velocityY = -10; // Gib dem Spieler einen kleinen "Bounce" nach oben
                    if (this.selectedTheme) {
                        const destruction = this.selectedTheme.enemyAsset.destruction;
                        this.particles.push(new Particle(enemy.x + enemy.width / 2, // Zentrum des Gegners
                        enemy.y + enemy.height / 2, destruction.src, destruction.frameCount, destruction.size));
                    }
                    this.enemies.splice(index, 1); // Entferne den besiegten Gegner
                }
                else {
                    this.enemies.splice(index, 1);
                    this.triggerShake(200); // Shake für 200 Millisekunden
                }
            }
        });
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
        this.particles.forEach((particle, index) => {
            particle.update(deltaTime); // HIER wird die update-Methode des Partikels aufgerufen
            if (particle.markedForDeletion) {
                this.particles.splice(index, 1);
            }
        });
    }
    /**
    * Zeigt den "Level geschafft!"-Bildschirm an.
    */
    showEndScreen() {
        if (this.selectedTheme) {
            // Setze den Hintergrund des Overlays passend zum Thema
            this.endScreenOverlay.style.backgroundImage = `url(${this.selectedTheme.backgroundImageSrc})`;
        }
        // Lade das Sieges-Video und spiele es ab
        this.winVideo.src = this.selectedTheme.winVideoSrc;
        this.winVideo.play();
        // Zeige das Overlay an
        this.endScreenOverlay.style.display = 'flex';
    }
    /**
     * Zeichnet den gesamten Spielzustand auf die Canvas.
     */
    draw() {
        // 1. Zuerst die Leinwand komplett säubern.
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        // 2. Zeichne den scrollenden Hintergrund als unterste Ebene.
        if (this.background) {
            this.background.draw(this.ctx);
        }
        // 3. Speichere den aktuellen Zustand (für den Shake-Effekt).
        this.ctx.save();
        if (this.shakeDuration > 0) {
            const shakeX = (Math.random() - 0.5) * 2 * this.shakeMagnitude;
            const shakeY = (Math.random() - 0.5) * 2 * this.shakeMagnitude;
            this.ctx.translate(shakeX, shakeY);
        }
        // 4. Speichere den Zustand erneut (jetzt mit der Shake-Verschiebung).
        // Dies ist ein Trick, um die Transparenz-Änderung isoliert zu halten.
        this.ctx.save();
        // 5. Setze die Deckkraft NUR für die nächste Zeichenoperation.
        this.ctx.globalAlpha = 0.5; // Experimentiere mit diesem Wert! 0.4 - 0.6 ist oft gut.
        // 6. Zeichne das Kamerabild. Es wird jetzt halbtransparent sein.
        this.ctx.drawImage(this.video, 0, 0, this.gameWidth, this.gameHeight);
        // 7. Stelle den Zustand von vor der Transparenz-Änderung wieder her.
        // globalAlpha ist jetzt automatisch wieder 1.0.
        this.ctx.restore();
        // 8. Zeichne alle Spielobjekte mit voller Deckkraft.
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
        if (this.player) {
            this.player.draw(this.ctx);
        }
        // 9. Setze die Canvas auf den unverschobenen Zustand zurück.
        this.ctx.restore();
        // 10. Zeichne die UI als allerletzte, oberste Schicht.
        this.drawUI();
    }
    /** Zeichnet die Benutzeroberfläche (Leben, Game Over) über das Spielgeschehen. */
    drawUI() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'left';
        // NEU: Zeitanzeige
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = Math.floor(this.timeRemaining % 60);
        this.ctx.fillText(`Zeit: ${minutes}:${seconds.toString().padStart(2, '0')}`, 20, 40);
        this.ctx.fillText(`Score: ${this.score}`, 20, 80);
    }
    /** Aktualisiert den Inhalt des Debug-Log-Fensters mit Echtzeit-Daten. */
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
-- particle -- 
${particleInfo} // Füge die neuen Partikel-Infos hier ein
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
     * Die zentrale Spiel-Schleife, die ca. 60 Mal pro Sekunde aufgerufen wird.
     * @param timestamp Ein hochpräziser Zeitstempel vom Browser.
     */
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
    /**
     * Löst einen Screen-Shake-Effekt aus.
     * @param duration Die Dauer des Effekts in Millisekunden.
     */
    triggerShake(duration) {
        this.shakeDuration = duration;
    }
}
// Erstellt die Spiel-Instanz. Die Initialisierung erfolgt in `init()` nach `window.onload`.
new Game();
