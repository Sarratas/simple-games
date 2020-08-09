import { KeyState, Constants } from "./declarations.js";
import { Ball } from "./ball.js";
import { Player } from "./player.js";
import { Canvas } from './canvas.js';
import { Renderer } from "./renderer.js";

const playerColors = {
    [Constants.LEFT_PLAYER]: '#66B2FF',
    [Constants.RIGHT_PLAYER]: '#FF6666',
}

export default class PongGame {
    gameRenderInterval: number;
    gameUpdateInterval: number;

    keyState: KeyState;

    ball: Ball;
    players: [Player, Player];

    stopped: boolean;
    winner: Constants.LEFT_PLAYER | Constants.RIGHT_PLAYER;

    constructor(canvas: HTMLCanvasElement) {
        Canvas.setCanvas(canvas);

        this.gameUpdateInterval = setInterval(() => this.update(), 1000 / Constants.UPDATES_PER_SECOND);
        this.gameRenderInterval = setInterval(() => this.render(), 1000 / Constants.RENDERS_PER_SECOND);
        this.keyState = {};

        this.ball = new Ball({
            x: Canvas.width / 2,
            y: Canvas.height / 2
        });

        this.players = this.createPlayers();

        this.stopped = false;
        this.winner = -1;
    }

    start(): void {
        this.bindEventListeners();
    }

    stop(): void {
        this.stopped = true;
        clearInterval(this.gameRenderInterval);
        clearInterval(this.gameUpdateInterval);
        window.removeEventListener('keydown', this.handleKeyDown);
        Renderer.renderScore(playerColors[this.winner], this.winner === Constants.LEFT_PLAYER ? 'Left' : 'Right');
    }

    exit(): void {
        Renderer.clear();
    }

    private createPlayers(): [Player, Player] {
        return [
            new Player(
                {
                    x: Constants.PLAYER_WIDTH / 2 + Constants.BORDER_OFFSET,
                    y: Canvas.height / 2
                },
                {
                    up: 'ArrowUp',
                    down: 'ArrowDown',
                },
                playerColors[Constants.LEFT_PLAYER],
            ),
            new Player(
                {
                    x: Canvas.width - Constants.PLAYER_WIDTH / 2 - Constants.BORDER_OFFSET,
                    y: Canvas.height / 2,
                },
                {
                    up: 'w',
                    down: 's',
                },
                playerColors[Constants.RIGHT_PLAYER],
            ),
        ];
    }

    private render() {
        if (this.stopped) return;

        Renderer.render(this.ball, this.players);
    }

    private bindEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    private handleKeyDown(event: KeyboardEvent) {
        this.keyState[event.key] = true;
    }

    private handleKeyUp(event: KeyboardEvent) {
        this.keyState[event.key] = false;
    }

    private update() {
        if (this.stopped) return;

        this.ball.update();
        this.players.forEach(player => player.update(this.keyState));
        this.handleCollisions();
    }

    private handleCollisions() {
        this.handleCollisionsWithPlayers();
        this.handleCollisionsWithWalls();
    }

    private handleCollisionsWithPlayers() {
        while (this.isBallInBounceZone()) {
            const collided = this.handleLeftCollision() || this.handleRightCollision();
            if (!collided) {
                if (this.isBallInOffsetZone()) {
                    this.winner = this.getWinner();
                    this.render();
                    this.stop();
                }
                return;
            }
        }
    }

    private handleCollisionsWithWalls() {
        if (this.isBallAboveTop() || this.isBallBelowBottom()) {
            this.ball.bounceY();
        }
    }

    private isBallAboveTop() {
        return this.ball.pos.y < 0 + Constants.BALL_RADIUS;
    }

    private isBallBelowBottom() {
        return this.ball.pos.y > Canvas.height - Constants.BALL_RADIUS;
    }

    private handleLeftCollision() {
        if (this.isBallInLeftBounceZone()) {
            if (this.detectCollisionWithPlayer(Constants.LEFT_PLAYER)) {
                this.ball.bounceX(this.players[Constants.LEFT_PLAYER]);
                return true;
            }
        }
        return false;
    }

    private handleRightCollision() {
        if (this.isBallInRightBounceZone()) {
            if (this.detectCollisionWithPlayer(Constants.RIGHT_PLAYER)) {
                this.ball.bounceX(this.players[Constants.RIGHT_PLAYER]);
                return true;
            }
        }
        return false;
    }

    private isBallInBounceZone() {
        return this.isBallInLeftBounceZone() || this.isBallInRightBounceZone();
    }

    private isBallInLeftBounceZone() {
        return this.ball.isMovingLeft() && this.ball.pos.x < Canvas.getLeftBounceZonePos();
    }

    private isBallInRightBounceZone() {
        return this.ball.isMovingRight() && this.ball.pos.x > Canvas.getRightBounceZonePos();
    }

    private isBallInOffsetZone() {
        return this.isBallInLeftOffsetZone() || this.isBallInRightOffsetZone();
    }

    private isBallInLeftOffsetZone() {
        return this.ball.pos.x < Canvas.getLeftOffsetLinePos();
    }

    private isBallInRightOffsetZone() {
        return this.ball.pos.x > Canvas.getRightOffsetLinePos();
    }

    private detectCollisionWithPlayer(playerIndex: Constants.LEFT_PLAYER | Constants.RIGHT_PLAYER) {
        return (this.ball.pos.y >= this.players[playerIndex].pos.y - Constants.PLAYER_HEIGHT / 2 - Constants.BALL_RADIUS &&
            this.ball.pos.y <= this.players[playerIndex].pos.y + Constants.PLAYER_HEIGHT / 2 + Constants.BALL_RADIUS);
    }

    private getWinner() {
        return this.ball.isMovingLeft() ? Constants.RIGHT_PLAYER : Constants.LEFT_PLAYER;
    }
}