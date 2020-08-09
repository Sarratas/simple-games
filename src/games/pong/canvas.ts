import { Constants } from "./declarations.js";

export class Canvas {
    static canvas: HTMLCanvasElement;

    static setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
    }

    static get width(): number {
        return this.canvas.width;
    }

    static get height(): number {
        return this.canvas.height;
    }

    static get ctx(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    static getRightBounceZonePos(): number {
        return this.getRightOffsetLinePos() - Constants.BALL_RADIUS;
    }

    static getLeftBounceZonePos(): number {
        return 0 + Constants.BALL_RADIUS + Canvas.getLeftOffsetLinePos();
    }

    static getLeftOffsetLinePos(): number {
        return Constants.BORDER_OFFSET + Constants.PLAYER_WIDTH;
    }

    static getRightOffsetLinePos(): number {
        return Canvas.width - Constants.BORDER_OFFSET - Constants.PLAYER_WIDTH
    }
}