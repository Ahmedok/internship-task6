# Online Tic Tac Toe Game (Task #6)

This is a training project built with React (TS + Tailwind) and Node.js (Express).
The main goal was to create Tic-Tac-Toe game with nice visuals and smooth game flow.

**Deployed App:** [https://task6.miskaris.com](https://task6.miskaris.com)

## Features

- **Unlimited 1-on-1 gaming:** Play Tic Tac Toe in browser with anonymous opponents, or invite your friends with Room ID. Rematches and local head-to-head record included!
- **Clean design:** Sleek modern and minimalistic game visuals.
- **Sounds and haptic feedback:** Sound indication for moves, game endings. Vibration on mobile devices.
- **Performance:** Socket.io based multiplayer with Zod schema validations.

## How to run locally

The project is fully containerized.

1. Clone the repository.
2. Run with Docker Compose:
    ```bash
    docker-compose up --build
    ```
3. Open http://localhost:3000 in your browser.
