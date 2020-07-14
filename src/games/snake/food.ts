import { Pos2D, Config } from "./declarations.js";

const colorsTable = [
    'white',
    'gainsboro',
    'bisque',
    'wheat',
    'goldenrod',
    'peru',
    'chocolate',
    'olive',
    'olivedrab',
    'green',
    'red'
];

export default class Food {
    readonly position: Pos2D; 

    value: number;

    constructor(position: Pos2D, value: number) {
        this.position = position;
        this.value = value;

        const special = Math.random() < Config.SpecialFoodChance / 100;
        if (special) {
            this.value *= Config.SpecialFoodMultiplier;
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        const offset = Config.SegmentSize / 2;

        ctx.fillStyle = colorsTable[Math.min(this.value, 10)];
        ctx.fillRect(this.position.x - offset, this.position.y - offset, Config.SegmentSize, Config.SegmentSize);
        this.renderText(ctx);
    }

    renderText(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.value > 3 ? 'white' : 'black';
        ctx.font = "bold 15px Arial";

        const textOffsetX = this.value >= 10 ? 8 : 4;
        const textOffsetY = 6;
        ctx.fillText(this.value.toString(), this.position.x - textOffsetX, this.position.y + textOffsetY); 
    }

    update(): void {
        if (this.value >= Config.FoodFadeLimit) {
            this.value -= 1;
        }
    }
}