import { Pos2D, ArrowKey, Config, Colors } from "./declarations.js";
import Food from "./food.js";

export default class Snake {
    private get head(): Pos2D {
        return this.segments[0];
    }

    private set head(pos: Pos2D) {
        this.segments[0] = pos;
    }

    private segments: Pos2D[];
    private length: number;
    private boundary: Pos2D;

    constructor(initialPosition: Pos2D, boundary: Pos2D) {
        this.segments = [initialPosition, initialPosition, initialPosition ];
        this.boundary = boundary;
        this.length = Config.SnakeInitialLength;
    }

    moveLeft(): void {
        const newPos = { x: this.head.x - Config.SegmentSize, y: this.head.y };
        this.moveTo(newPos);
    }

    moveRight(): void {
        const newPos = { x: this.head.x + Config.SegmentSize, y: this.head.y };
        this.moveTo(newPos);
    }

    moveUp(): void {
        const newPos = { x: this.head.x, y: this.head.y - Config.SegmentSize };
        this.moveTo(newPos);
    }

    moveDown(): void {
        const newPos = { x: this.head.x, y: this.head.y + Config.SegmentSize };
        this.moveTo(newPos);
    }

    handleBoundary(): void {
        const head = this.head;
        const offset = Config.SegmentSize / 2;
        if (head.x > this.boundary.x - offset) {
            head.x = offset;
        }
        if (head.y > this.boundary.y - offset) {
            head.y = offset;
        }
        if (head.x < offset) {
            head.x = this.boundary.x - offset;
        }
        if (head.y < offset) {
            head.y = this.boundary.y - offset;
        }
        this.head = head;
    }

    moveTo(pos: Pos2D): void {
        this.segments.unshift(pos);
        this.segments = this.segments.slice(0, this.length);
    }

    getSegments(): Pos2D[] {
        return this.segments;
    }

    update(key: ArrowKey): void {
        switch (key) {
            case 'ArrowDown':
                this.moveDown();
                break;
            case 'ArrowUp':
                this.moveUp();
                break;
            case 'ArrowLeft':
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.moveRight();
                break;
            default:
                break;
        }
        this.handleBoundary();
    }

    render(ctx: CanvasRenderingContext2D): void {
        const offset = Config.SegmentSize / 2;
        const segmentPadding = 1;
        const [head, ...segments] = this.segments;
        for (const segment of segments) {
            ctx.fillStyle = Colors.SnakeSegment;
            const posX = segment.x - offset + segmentPadding;
            const posY = segment.y - offset + segmentPadding;
            const segmentRenderSize = Config.SegmentSize - segmentPadding * 2;
            ctx.fillRect(posX, posY, segmentRenderSize, segmentRenderSize);
        }
        ctx.fillStyle = Colors.SnakeHead;
        ctx.fillRect(head.x - offset, head.y - offset, Config.SegmentSize, Config.SegmentSize);
    }

    eat(food: Food): void {
        this.length += food.value;
    }
}