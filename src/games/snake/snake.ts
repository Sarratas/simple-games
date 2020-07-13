import { Pos2D, ArrowKey, SEGMENT_SIZE } from "./declarations.js";
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
        this.length = 10;
    }

    moveLeft(): void {
        const newPos = { x: this.head.x - SEGMENT_SIZE, y: this.head.y };
        this.moveTo(newPos);
    }

    moveRight(): void {
        const newPos = { x: this.head.x + SEGMENT_SIZE, y: this.head.y };
        this.moveTo(newPos);
    }

    moveUp(): void {
        const newPos = { x: this.head.x, y: this.head.y - SEGMENT_SIZE };
        this.moveTo(newPos);
    }

    moveDown(): void {
        const newPos = { x: this.head.x, y: this.head.y + SEGMENT_SIZE };
        this.moveTo(newPos);
    }

    handleBoundary(): void {
        const head = this.head;
        const offset = SEGMENT_SIZE / 2;
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
        const offset = SEGMENT_SIZE / 2;
        const [head, ...segments] = this.segments;
        for (const segment of segments) {
            ctx.fillStyle = 'black';
            ctx.fillRect(segment.x - offset + 1, segment.y - offset + 1, SEGMENT_SIZE - 2, SEGMENT_SIZE - 2);
        }
        ctx.fillStyle = 'blue';
        ctx.fillRect(head.x - offset, head.y - offset, SEGMENT_SIZE, SEGMENT_SIZE);
    }

    eat(food: Food): void {
        this.length += food.value;
    }
}