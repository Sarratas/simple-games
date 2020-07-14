import { Pos2D, SEGMENT_SIZE } from "./declarations.js";

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

        const special = Math.random() < 0.1;
        if (special) {
            this.value *= 10;
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        const offset = SEGMENT_SIZE / 2;

        ctx.fillStyle = colorsTable[Math.min(this.value, 10)];
        ctx.fillRect(this.position.x - offset, this.position.y - offset, SEGMENT_SIZE, SEGMENT_SIZE);
        ctx.fillStyle = this.value > 3 ? 'white' : 'black';
        ctx.font = "bold 15px Arial";
        ctx.fillText(this.value.toString(), this.position.x - (this.value >= 10 ? 8 : 4), this.position.y + 6); 
    }

    update(): void {
        if (this.value >= 10) {
            this.value -= 1;
        }
    }
}