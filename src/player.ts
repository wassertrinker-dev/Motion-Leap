// in /src/player.ts
import { AnimationAssets } from "./themes.js";

export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
    gravity: number;

    // Animationssteuerung
    image: HTMLImageElement;
    frameX: number = 0;
    maxFrame: number;
    fps: number = 15;
    frameTimer: number = 0;
    frameInterval: number ;

    // NEU: Die "State Machine"
    currentState: 'IDLE' | 'JUMPING' | 'FALLING' = 'FALLING'; //start with falling
    animations: AnimationAssets;

    // Die 'image'-Eigenschaft deklarieren
    isImageLoaded: boolean = false;

   constructor(gameWidth: number, gameHeight: number, animations: AnimationAssets) {
        // Die Größe wird vom ersten Sprite-Sheet bestimmt (Annahme: alle sind gleich)
        this.width = 200;  
        this.height = 200; 
        
        this.x = 50;
        this.y = 0;
        this.velocityY = 0;
        this.gravity = 0.5;

        this.frameInterval = 1000 / this.fps;

        this.animations = animations;
        this.image = new Image();
        this.image.onload = () => {
            this.isImageLoaded = true;
        };
        this.maxFrame = 0; // Wird in setState gesetzt
        this.setState('FALLING'); // Setze den initialen Zustand und lade das erste Bild
    }

     draw(context: CanvasRenderingContext2D) {
         if (this.isImageLoaded) {
            context.drawImage(
                this.image,
                this.frameX * this.width,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    update(deltaTime: number, gameHeight: number) {
        // 1. Physik-Update (unverändert)
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // 2. Zustandsübergänge prüfen
       if (this.y + this.height >= gameHeight && this.velocityY >= 0) {
            this.y = gameHeight - this.height;
            this.velocityY = 0;
            this.setState('IDLE');
        } else if (this.velocityY > 0) {
            this.setState('FALLING');
        } else if (this.velocityY < 0) {
            this.setState('JUMPING');
        }


        // 3. Animations-Frame-Update
        if (this.frameTimer > this.frameInterval) {
            this.frameX = (this.frameX + 1) % this.maxFrame;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

     /**
     * Setzt einen neuen Zustand und aktualisiert das Sprite Sheet, falls es sich ändert.
     * @param newState Der neue Zustand ('IDLE', 'JUMPING', oder 'FALLING')
     */
     setState(newState: 'IDLE' | 'JUMPING' | 'FALLING') {
        // Führe den Code nur aus, wenn sich der Zustand wirklich ändert
        if (this.currentState === newState) return;

        this.currentState = newState;
        switch (newState) {
            case 'IDLE':
                 this.image.src = this.animations.jump.src;
                 this.maxFrame = 1; 
                break;
            case 'JUMPING':
                this.image.src = this.animations.jump.src;
                this.maxFrame = this.animations.jump.frameCount;
                break;
            case 'FALLING':
                this.image.src = this.animations.fall.src;
                this.maxFrame = this.animations.fall.frameCount;
                break;
        }
        this.frameX = 0; // Setze die Animation bei jedem Zustandswechsel zurück
    }

    jump() {
    // Prüfe, ob der Spieler überhaupt springen darf
    if (this.currentState === 'IDLE') {
        // Setze die Physik für den Sprung
        this.velocityY = -20;
        // ÄNDERUNG: Setze den Animationszustand SOFORT und DIREKT
        this.setState('JUMPING');
    }
}
}