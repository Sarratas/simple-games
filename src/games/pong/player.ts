import { Pos2D, Hotkeys, KeyState, Constants } from "./declarations.js";
import { Canvas } from "./canvas.js";

export class Player {
    pos: Pos2D;
    width: number;
    height: number;
    hotkeys: Hotkeys;
    color: string;
    boundaries: { min: number, max: number };

    constructor(pos: Pos2D, hotkeys: Hotkeys, color: string) {
        this.pos = pos;
        this.width = Constants.PLAYER_WIDTH;
        this.height = Constants.PLAYER_HEIGHT;
        this.hotkeys = hotkeys;
        this.color = color;
        this.boundaries = {
            min: this.height / 2 + Constants.BORDER_OFFSET,
            max: Canvas.height - this.height / 2 - Constants.BORDER_OFFSET,
        }
    }

    update(keyState: KeyState): void {
        if (keyState[this.hotkeys.up]) {
            this.pos.y -= Constants.PLAYER_SPEED;
        }
        if (keyState[this.hotkeys.down]) {
            this.pos.y += Constants.PLAYER_SPEED;
        }

        this.checkBoundary();
    }

    checkBoundary(): void {
        if (this.pos.y > this.boundaries.max) {
            this.pos.y = this.boundaries.max;
        }
        if (this.pos.y < this.boundaries.min) {
            this.pos.y = this.boundaries.min;
        }
    }
}