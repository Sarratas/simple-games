import Game from "../game.js";
import Snake from "./snake.js";
import Food from "./food.js";
import { ArrowKey, Pos2D, Colors, Config } from "./declarations.js";
import { randomInt, randomIntWithDivisor } from "./utils.js";

const enum SoundID {
    Eat,
    Lose
}

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

    sounds: { [key in SoundID]: HTMLAudioElement };

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvasSize = { x: canvas.width, y: canvas.height };

        const initialX = canvas.width / 2 - Config.SegmentSize / 2;
        const initialY = canvas.width / 2 - Config.SegmentSize / 2;
        const snakePos = { x: initialX, y: initialY };
        this.snake = new Snake(snakePos, this.canvasSize);

        this.gameInterval = setInterval(() => this.update(), 1000 / Config.FramesPerSecond);

        this.currentKey = 'ArrowRight';
        this.newKey = 'ArrowRight';

        this.foodList = [];
        this.foodSpawnTimer = 0;

        this.sounds = {
            [SoundID.Eat]: new Audio('assets/snap.ogg'),
            [SoundID.Lose]: new Audio('assets/lose.wav'),
        };
    }

    stop(): void {
        clearInterval(this.gameInterval);
        window.removeEventListener('keydown', this.handleKeyDown);
        this.showScore();
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
        if (this.foodList.length >= Config.MaxFoodCount || this.foodSpawnTimer++ < Config.FoodSpawnTimer) return;

        this.foodSpawnTimer = 0;
        this.spawnFoodUnit();
    }

    private spawnFoodUnit() {
        const value = randomInt(Config.FoodMinValue, Config.FoodMaxValue);
        const pos = this.getRandomPos();

        if (pos) {
            this.foodList.push(new Food(pos, value));
        }
    }

    private getRandomPos(): Pos2D | undefined {
        let retryCount = Config.MaxSpawnRetryCount;

        while (retryCount--) {
            const offset = Config.SegmentSize / 2;

            const x = randomIntWithDivisor(0, this.canvasSize.x, Config.SegmentSize) + offset;
            const y = randomIntWithDivisor(0, this.canvasSize.y, Config.SegmentSize) + offset;
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
        this.ctx.fillStyle = Colors.CanvasBackground;
        this.ctx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        
        this.foodList.forEach(food => food.render(this.ctx));
        this.snake.render(this.ctx);
    }

    private showScore() {
        const score = this.snake.getSegments().length;
        const text = 'Your score:';
        const boxWidth = 200;
        const boxHeight = 100;

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.canvasSize.x / 2 - boxWidth / 2 - 2, this.canvasSize.y / 2 - boxHeight / 2 - 2, boxWidth + 4, boxHeight + 4);
        this.ctx.fillStyle = 'white';
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(this.canvasSize.x / 2 - boxWidth / 2, this.canvasSize.y / 2 - boxHeight / 2, boxWidth, boxHeight);
        this.ctx.globalAlpha = 1.0;

        this.ctx.fillStyle = 'black';
        this.ctx.font = "bold 30px Arial";
        const textBounds = this.ctx.measureText(text);
        this.ctx.fillText(text, this.canvasSize.x / 2 - textBounds.width / 2, this.canvasSize.y / 2 - 5);
        const scoreBounds = this.ctx.measureText(score.toString());
        this.ctx.fillText(score.toString(), this.canvasSize.x / 2 - scoreBounds.width / 2, this.canvasSize.y / 2 + 25);
    }

    private detectCollisions() {
        const [head, ...segments] = this.snake.getSegments();

        for (const segment of segments) {
            if (head.x === segment.x && head.y === segment.y) {
                this.playSound(SoundID.Lose);
                this.stop();
            }
        }

        const foodToEat = this.foodList.find(food => food.position.x === head.x && food.position.y === head.y);
        if (foodToEat) {
            this.snake.eat(foodToEat);
            this.playSound(SoundID.Eat);
            this.foodList = this.foodList.filter(food => food !== foodToEat);
        }
    }

    private playSound(sound: SoundID) {
        this.sounds[sound].currentTime = 0;
        this.sounds[sound].play();
    }
}