# Camera Jump 'n' Run

A classic 2D Jump 'n' Run game with a unique twist: you control the character's jump by physically jumping in front of your camera!

## About The Game

This is a simple platformer where the goal is to score points by jumping on enemies within a time limit. The main feature is the motion-controlled jump, which uses your webcam to detect your body movements.

## Features

- **Motion-Controlled Jumps:** The game uses your webcam and TensorFlow.js to detect when you jump. Jump in real life to make your character jump in the game!
- **Multiple Themes:** Choose between different visual styles, like "Fairy Tale" or "Ninja".
- **Localization:** The game supports multiple languages (English, German, French, Spanish, Italian).
- **Score and Timer:** A classic arcade-style score and a time limit to challenge you.

## Technology Stack

- **Game Logic:** TypeScript
- **Rendering:** HTML5 Canvas
- **Pose Detection:** [TensorFlow.js](https://www.tensorflow.org/js) with the [MoveNet](https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html) model
- **Development Server:** [live-server](https://www.npmjs.com/package/live-server)
- **TypeScript Compilation:** [TypeScript Compiler (tsc)](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## How to Play

1.  **Prerequisites:** You need [Node.js](https://nodejs.org/) and npm installed.
2.  **Installation:** Clone the repository and install the development dependencies:
    ```bash
    npm install
    ```
3.  **Build the game:** Compile the TypeScript source code into JavaScript:
    ```bash
    npx tsc
    ```
    *Note: You need to re-run this command every time you make changes to the `.ts` files.*
4.  **Start the server:**
    ```bash
    live-server dist
    ```
5.  **Allow Camera Access:** Open the provided URL in your browser and allow camera access when prompted.
6.  **Play:** Choose a theme and start playing! Jump to avoid enemies or stomp on them.

## Configuration

You can change the game's behavior using URL parameters.

### Language Selection

You can select the display language by adding the `?lang=` parameter to the URL. The default language is English.

- **German:** `/?lang=de`
- **French:** `/?lang=fr`
- **Italian:** `/?lang=it`
- **Spanish:** `/?lang=es`

**Example:** `http://127.0.0.1:8080/?lang=de`

### Debug Mode

To enable the debug mode, which shows real-time information about pose detection and game state, add `?debug=true` to the URL.

**Example:** `http://127.0.0.1:8080/?debug=true`
