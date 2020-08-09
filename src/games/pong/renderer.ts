import { Canvas } from "./canvas.js";
import { Constants } from "./declarations.js";
import { Ball } from "./ball.js";
import { Player } from "./player.js";

export class Renderer {
    static render(ball: Ball, players: [Player, Player]): void {
        Renderer.renderCanvas();
        Renderer.renderBall(ball);
        Renderer.renderPlayers(players);
    }

    static renderScore(winnerColor: string, winnerName: string): void {
        let text;
        if (winnerName) {
            text = `${winnerName} player has won!`;
        } else {
            text = 'No winner';
        }
        const boxWidth = 350;
        const boxHeight = 60;

        Canvas.ctx.fillStyle = winnerColor;
        Canvas.ctx.fillRect(Canvas.width / 2 - boxWidth / 2 - 2, Canvas.height / 2 - boxHeight / 2 - 2, boxWidth + 4, boxHeight + 4);
        Canvas.ctx.fillStyle = 'white';
        Canvas.ctx.globalAlpha = 0.7;
        Canvas.ctx.fillRect(Canvas.width / 2 - boxWidth / 2, Canvas.height / 2 - boxHeight / 2, boxWidth, boxHeight);
        Canvas.ctx.globalAlpha = 1.0;

        Canvas.ctx.fillStyle = winnerColor;
        Canvas.ctx.font = "bold 30px Arial";
        const textBounds = Canvas.ctx.measureText(text);
        Canvas.ctx.fillText(text, Canvas.width / 2 - textBounds.width / 2, Canvas.height / 2 + 10);
    }

    static clear(): void {
        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    }

    private static renderCanvas() {
        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        Canvas.ctx.fillStyle = 'wheat';
        Canvas.ctx.fillRect(0, 0, Canvas.width, Canvas.height);
        Canvas.ctx.strokeStyle = 'black';
        Canvas.ctx.lineWidth = 1;
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(Constants.BORDER_OFFSET + Constants.PLAYER_WIDTH / 2, 0);
        Canvas.ctx.lineTo(Constants.BORDER_OFFSET + Constants.PLAYER_WIDTH / 2, Canvas.height);
        Canvas.ctx.stroke()
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(Canvas.width - Constants.BORDER_OFFSET - Constants.PLAYER_WIDTH / 2, 0);
        Canvas.ctx.lineTo(Canvas.width - Constants.BORDER_OFFSET - Constants.PLAYER_WIDTH / 2, Canvas.height);
        Canvas.ctx.stroke();
    }

    private static renderBall(ball: Ball) {
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2, true);
        Canvas.ctx.fillStyle = '#4C9900';
        Canvas.ctx.fill();
    }

    private static renderPlayers(players: [Player, Player]) {
        players.forEach(player => Renderer.renderPlayer(player));
    }

    private static renderPlayer(player: Player) {
        Canvas.ctx.fillStyle = player.color;
        Canvas.ctx.fillRect(player.pos.x - player.width / 2, player.pos.y - player.height / 2, player.width, player.height);
    }
}