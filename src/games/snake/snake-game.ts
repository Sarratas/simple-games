import Game from "../game.js";
import Snake from "./snake.js";
import Food from "./food.js";
import { ArrowKey, FRAMES_PER_SECOND, SEGMENT_SIZE, Pos2D, MAX_FOOD_COUNT, FOOD_SPAWN_TIMER, MAX_SPAWN_RETRY_COUNT } from "./declarations.js";
import { randomInt, randomIntWithDivisor } from "./utils.js";

export default class SnakeGame implements Game {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly canvasSize: Pos2D;

    readonly relevantKeys: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    snake: Snake;

    foodList: Food[];
    foodSpawnTimer: number;

    gameInterval: number;
    currentKey: ArrowKey;
    newKey: ArrowKey;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvasSize = { x: canvas.width, y: canvas.height };

        const snakePos = { x: canvas.width / 2 - SEGMENT_SIZE / 2, y: canvas.width / 2 - SEGMENT_SIZE / 2 };
        this.snake = new Snake(snakePos, this.canvasSize);

        this.gameInterval = setInterval(() => this.update(), 1000 / FRAMES_PER_SECOND);

        this.currentKey = 'ArrowRight';
        this.newKey = 'ArrowRight';

        this.foodList = [];
        this.foodSpawnTimer = 0;
    }

    stop(): void {
        clearInterval(this.gameInterval);
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    start(): void {
        this.bindEventListeners();
    }

    exit(): void {
        this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
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
        this.updateSnake();
        this.updateFood();
        this.render();
        this.detectCollisions();
    }

    private updateSnake() {
        this.currentKey = this.newKey;
        this.snake.update(this.currentKey);
    }

    private updateFood() {
        this.spawnFood();
        this.foodList.forEach(food => food.update());
    }

    private spawnFood() {
        if (this.foodList.length >= MAX_FOOD_COUNT || this.foodSpawnTimer++ < FOOD_SPAWN_TIMER) return;

        this.foodSpawnTimer = 0;
        this.spawnFoodUnit();
    }

    private spawnFoodUnit() {
        const value = randomInt(1, 9);
        const pos = this.getRandomPos();

        if (pos) {
            this.foodList.push(new Food(pos, value));
        }
    }

    private getRandomPos(): Pos2D | undefined {
        let retryCount = MAX_SPAWN_RETRY_COUNT;

        while (retryCount--) {
            const offset = SEGMENT_SIZE / 2;

            const x = randomIntWithDivisor(0, this.canvasSize.x, SEGMENT_SIZE) + offset;
            const y = randomIntWithDivisor(0, this.canvasSize.y, SEGMENT_SIZE) + offset;
            const pos: Pos2D = { x, y };

            if (!this.isPosOccupied(pos)) {
                return pos;
            }
        }
        return undefined;
    }

    private isPosOccupied(pos: Pos2D): boolean {
        return !!this.snake.getSegments().find(segment => segment.x === pos.x && segment.y === pos.y) ||
            !!this.foodList.find(food => food.position.x === pos.x && food.position.y === pos.y);
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        this.ctx.fillStyle = '#d4efdf';
        this.ctx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        
        this.foodList.forEach(food => food.render(this.ctx));
        this.snake.render(this.ctx);
    }

    private detectCollisions() {
        const [head, ...segments] = this.snake.getSegments();

        for (const segment of segments) {
            if (head.x === segment.x && head.y === segment.y) {
                this.stop();
            }
        }

        const foodToEat = this.foodList.find(food => food.position.x === head.x && food.position.y === head.y);
        if (foodToEat) {
            this.snake.eat(foodToEat);
            this.foodList = this.foodList.filter(food => food != foodToEat);
        }
    }
}