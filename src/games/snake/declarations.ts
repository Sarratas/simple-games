export type Pos2D = {
    x: number,
    y: number,
}

export const enum Config {
    SegmentSize = 20,
    FramesPerSecond = 15,
    SnakeInitialLength = 10,

    MaxFoodCount = 20,
    FoodSpawnTimer = 1 * FramesPerSecond,
    FoodMinValue = 1,
    FoodMaxValue = 9,
    SpecialFoodChance = 10,
    SpecialFoodMultiplier = 10,
    FoodFadeLimit = 10,
    MaxSpawnRetryCount = 5,
}

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export const enum Colors {
    CanvasBackground = '#d4efdf',
    SnakeSegment = 'black',
    SnakeHead = 'blue',
}