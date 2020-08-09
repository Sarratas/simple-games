export type Pos2D = {
    x: number,
    y: number,
}

export type Hotkeys = {
    up: string,
    down: string,
}

export type KeyState = Record<string, boolean>;

export const enum Constants {
    PLAYER_HEIGHT   = 80,
    PLAYER_WIDTH    = 16,
    BALL_RADIUS     = 10,
    BORDER_OFFSET   = 2,

    LEFT_PLAYER     = 0,
    RIGHT_PLAYER    = 1,
    PLAYER_SPEED    = 1,

    INITIAL_BALL_SPEED      = 1,
    BALL_SPEED_MULTIPLIER   = 1.01,

    RENDERS_PER_SECOND      = 60,
    UPDATES_PER_SECOND      = 250,
}