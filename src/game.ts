// in /src/game.ts

import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { themes, GameTheme } from './themes.js';
import { Particle } from './particle.js';
import { Background } from './background.js';

// Deklariert globale Variablen, die von externen Skripten (TensorFlow.js) geladen werden.
declare const poseDetection: any;
declare const tf: any;

/**
 * Die Hauptklasse, die das gesamte Spiel orchestriert.
 * Verwaltet die Spiel-Schleife, den Zustand, alle Spielobjekte, das Rendering und die Kamera-Eingabe.
 */
export class Game {
    // --- EIGENSCHAFTEN ---
    background: Background | null = null; // NEU: Eigenschaft für den Hintergrund
    // Canvas & Rendering
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;

    // Spiel-Dimensionen
    gameWidth!: number;
    gameHeight!: number;
    
    // HTML-Elemente
    startButton!: HTMLButtonElement;
    video!: HTMLVideoElement;
    logElement!: HTMLElement;
    themeSelectionContainer!: HTMLElement;
    loadingOverlay!: HTMLElement;
    progressBar!: HTMLElement;
    progressText!: HTMLElement;

    // Spiel-Objekte
    player: Player | null = null;
    enemies: Enemy[];
    particles: Particle[] = []; // NEU

    // Spielzustand & Timing
    lives!: number;
    score!: number;
    isGameOver!: boolean;
    selectedTheme: GameTheme | null = null;
    enemyTimer!: number;
    enemyInterval!: number;
    lastTime: number = 0;
    prevTime: number = 0;

    // Pose Detection
    poseDetector: any;
    lastShoulderY: number | null = null;
    JUMP_SENSITIVITY: number = 10;
    
    // Logging
    lastJumpMovement: number = 0;

    //  Eigenschaften für den Screen Shake
    shakeDuration: number = 0; // Wie lange der Shake noch andauert (in ms)
    shakeMagnitude: number = 5;  // Wie stark die Verschiebung ist (in Pixel)

    
    /**
     * Erstellt die Haupt-Spielinstanz.
     * Der Constructor ist schlank und delegiert die Initialisierung an die `init()`-Methode,
     * die erst nach dem vollständigen Laden der Seite aufgerufen wird.
     */
    constructor() {
        this.enemies = [];
        window.onload = () => this.init();
    }

    /**
     * Initialisiert das Spiel, nachdem die HTML-Seite vollständig geladen ist.
     * Holt alle HTML-Elemente, setzt Dimensionen und richtet Event-Listener ein.
     */
    init() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.startButton = document.getElementById('startButton') as HTMLButtonElement;
        this.video = document.getElementById('videoFeed') as HTMLVideoElement;
        this.logElement = document.getElementById('log-output')!;
        this.themeSelectionContainer = document.getElementById('theme-selection')!;
        this.loadingOverlay = document.getElementById('loading-overlay')!;
        this.progressBar = document.getElementById('progress-bar')!;
        this.progressText = document.getElementById('progress-text')!;

        this.gameWidth = 800;
        this.gameHeight = 600;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.lives = 0;
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
                const themeName = (event.currentTarget as HTMLElement).dataset.theme;
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
    async startGame() {
        this.loadingOverlay.style.display = 'flex';
        this.progressBar.style.width = '0%';
        this.progressText.innerText = '0%';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;
            await new Promise((resolve) => { this.video.onloadedmetadata = resolve; });
            
            await this.setupPoseDetection();

            this.canvas.style.display = 'block';
            this.startButton.style.display = 'none';
            
            this.lives = 300000; // Hoher Wert zum Testen
            this.score = 0;
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
        } finally {
            this.loadingOverlay.style.display = 'none';
        }
    }
    
    /**
     * Lädt und konfiguriert das MoveNet-Modell für die Posenerkennung.
     * Aktualisiert dabei den Ladebalken.
     */
    async setupPoseDetection() {
        await tf.ready();
        const model = poseDetection.SupportedModels.MoveNet;

        this.poseDetector = await poseDetection.createDetector(model, { 
            onProgress: (fraction) => {
                const percent = Math.floor(fraction * 100);
                this.progressBar.style.width = `${percent}%`;
                this.progressText.innerText = `${percent}%`;
            }
        });
        console.log('Posen-Modell geladen.');
    }

    /**
     * Analysiert das Kamerabild in jedem Frame, um eine Sprungbewegung zu erkennen.
     */
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
    update(deltaTime: number) {
     if (this.background) {
            this.background.update();
        }
        // NEU: Shake-Timer herunterzählen
    if (this.shakeDuration > 0) {
        this.shakeDuration -= deltaTime;
    }

    if (this.isGameOver || !this.player) return;

        if (this.isGameOver || !this.player) return;
        this.player.update(deltaTime, this.gameHeight);

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
                    this.particles.push(new Particle(
                        enemy.x + enemy.width / 2, // Zentrum des Gegners
                        enemy.y + enemy.height / 2,
                        destruction.src,
                        destruction.frameCount,
                        destruction.size
                    ));
                }
            
            this.enemies.splice(index, 1); // Entferne den besiegten Gegner
        } else {
                
                this.enemies.splice(index, 1);
                this.lives--;
                if (this.lives <= 0) {
                    this.isGameOver = true;
                }

                this.triggerShake(200); // Shake für 200 Millisekunden

            }
        }});
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);

        this.particles.forEach((particle, index) => {
        particle.update(deltaTime); // HIER wird die update-Methode des Partikels aufgerufen
        if (particle.markedForDeletion) {
            this.particles.splice(index, 1);
        }
    });
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
        this.ctx.fillText(`Leben: ${this.lives}`, 20, 40);
         this.ctx.fillText(`Punktestand: ${this.score}`, 20, 80); // NEU

        if (this.isGameOver) {
            this.ctx.textAlign = 'center';
            this.ctx.font = '60px Arial';
            this.ctx.fillText('Game Over', this.gameWidth / 2, this.gameHeight / 2);
        }
    }

    /** Aktualisiert den Inhalt des Debug-Log-Fensters mit Echtzeit-Daten. */
    updateLog() {
        if (!this.player) return;
        const fps = (1000 / (this.lastTime - this.prevTime)).toFixed(1);
     
        let particleInfo = '-- PARTICLES --\n';
    if (this.particles.length > 0) {
        const firstParticle = this.particles[0];
        particleInfo += `Count:          ${this.particles.length}\n`;
        particleInfo += `Frame:          ${firstParticle.frameX} / ${firstParticle.maxFrame - 1}\n`;
        particleInfo += `Timer:          ${firstParticle.frameTimer.toFixed(0)} / ${firstParticle.frameInterval.toFixed(0)}\n`;
    } else {
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
Lives:          ${this.lives}
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


/**
 * Löst einen Screen-Shake-Effekt aus.
 * @param duration Die Dauer des Effekts in Millisekunden.
 */
triggerShake(duration: number) {
    this.shakeDuration = duration;
}
}

// Erstellt die Spiel-Instanz. Die Initialisierung erfolgt in `init()` nach `window.onload`.
new Game();