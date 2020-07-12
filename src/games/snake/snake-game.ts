import Game from "../game.js";
import Snake from "./snake.js";
import { ArrowKey, FRAMES_PER_SECOND, SEGMENT_SIZE, Pos2D } from "./declarations.js";

export default class SnakeGame implements Game {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly canvasSize: Pos2D;

    readonly relevantKeys: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    snake: Snake;

    gameInterval: number;
    currentKey: ArrowKey;
    newKey: ArrowKey;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvasSize = { x: canvas.width, y: canvas.height };

        const snakePos = { x: canvas.width / 2 - SEGMENT_SIZE / 2, y: canvas.width / 2 - SEGMENT_SIZE / 2 };
        this.snake = new Snake(snakePos, this.canvasSize);

        this.gameInterval = setInterval(() => this.update(), 1000 / FRAMES_PER_SECOND);
        setInterval(() => this.snake.eat(), 100);

        this.currentKey = 'ArrowRight';
        this.newKey = 'ArrowRight';
    }

    stop(): void {
        clearInterval(this.gameInterval);
        //this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    start(): void {
        this.bindEventListeners();
    }

    private bindEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (this.isKeyRelevant(event.key)) {
            this.newKey = event.key as ArrowKey;
        }
    }

    private isKeyRelevant(key: string): boolean {
        return this.relevantKeys.some(elem => elem === key) && !this.isKeyOppositeDirection(key);
    }

    private isKeyOppositeDirection(key: string): boolean {
        return key === 'ArrowLeft' && this.currentKey === 'ArrowRight' ||
            key === 'ArrowRight' && this.currentKey === 'ArrowLeft' ||
            key === 'ArrowUp' && this.currentKey === 'ArrowDown' ||
            key === 'ArrowDown' && this.currentKey === 'ArrowUp';
    }

    private update() {
        this.currentKey = this.newKey;
        this.snake.update(this.currentKey);
        this.render();
        this.detectCollisions();
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        
        const offset = SEGMENT_SIZE / 2;
        const [head, ...segments] = this.snake.getSegments();
        for (const segment of segments) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(segment.x - offset, segment.y - offset, SEGMENT_SIZE, SEGMENT_SIZE);
        }
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(head.x - offset, head.y - offset, SEGMENT_SIZE, SEGMENT_SIZE);
    }

    private detectCollisions() {
        const [head, ...segments] = this.snake.getSegments();

        for (const segment of segments) {
            if (head.x === segment.x && head.y === segment.y) {
                this.stop();
            }
        }
    }
}