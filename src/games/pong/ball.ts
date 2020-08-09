import { Pos2D, Constants } from "./declarations.js";
import { Player } from "./player.js";
import { Canvas } from "./canvas.js";

export class Ball {
    pos: Pos2D
    radius: number;
    speedX: number;
    speedY: number;

    constructor(pos: Pos2D) {
        this.pos = pos;
        this.radius = Constants.BALL_RADIUS;
        this.speedX = Constants.INITIAL_BALL_SPEED;
        this.speedY = Math.random() - 0.5;
    }

    bounceX(player: Player): void {
        this.speedX = this.calcNewSpeedX();
        this.speedY = this.calcNewSpeedY(player);


        this.pos.x = 2 * (this.isMovingLeft() ? Canvas.getRightBounceZonePos() : Canvas.getLeftBounceZonePos()) - this.pos.x;
    }

    bounceY(): void {
        this.speedY = -this.speedY;
    }

    update(): void {
        this.pos.x += this.speedX;
        this.pos.y += this.speedY;
    }

    isMovingLeft(): boolean {
        return this.speedX < 0;
    }

    isMovingRight(): boolean {
        return this.speedX > 0;
    }

    private calcNewSpeedX() {
        return -this.speedX * Constants.BALL_SPEED_MULTIPLIER;
    }

    private calcNewSpeedY(player: Player) {
        const playerOffset = player.pos.y - this.pos.y;
        const playerHalfHeight = Constants.PLAYER_HEIGHT / 2;
        const speedYModifier = playerOffset / playerHalfHeight;
        return this.applySpeedYLimit(this.speedY - speedYModifier);
    }

    private applySpeedYLimit(speedY: number) {
        const absSpeedX = Math.abs(this.speedX);
        return Math.max(Math.min(speedY, absSpeedX), -absSpeedX);
    }
}