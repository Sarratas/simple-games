import Game from "./games/game.js";
import SnakeGame from "./games/snake/snake-game.js";

const enum GameType {
    Snake = 'snake',
}

class Manager {
    private readonly canvasWrapper: HTMLDivElement;
    private readonly buttonsWrapper: HTMLDivElement;
    private readonly backButton: HTMLButtonElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    private currentGame: Game | undefined;

    constructor(canvas: HTMLCanvasElement, canvasWrapper: HTMLDivElement, buttonsWrapper: HTMLDivElement, backButton: HTMLButtonElement) {
        this.canvasWrapper = canvasWrapper;
        this.buttonsWrapper = buttonsWrapper;
        this.backButton = backButton;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.setEventListeners();
    }

    setEventListeners(): void {
        this.buttonsWrapper.addEventListener('click', (event) => this.handleGameButtonClick(event));
        this.backButton.addEventListener('click', () => this.handleBackButtonClick());
    }

    handleGameButtonClick(event: Event): void {
        const target = event.target as HTMLButtonElement;
        const isButton = target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        this.startGame(target.id as GameType);
    }

    handleBackButtonClick(): void {
        if (this.currentGame) {
            this.currentGame.exit();
        }
        this.showMenu();
    }

    startGame(gameType: GameType): void {
        switch (gameType) {
            case GameType.Snake:
                this.currentGame = new SnakeGame(this.canvas);
                this.currentGame.start();
                break;
            default:
                break;
        }
        this.hideMenu();
    }

    hideMenu(): void {
        this.canvasWrapper.style.display = "flex";
        this.buttonsWrapper.style.display = "none";
    }

    showMenu(): void {
        this.canvasWrapper.style.display = "none";
        this.buttonsWrapper.style.display = "flex";
    }
}

export {
    GameType,
    Manager
};
