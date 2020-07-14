export default interface Game {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    stop: () => void;
    start: () => void;
    exit: () => void;
}