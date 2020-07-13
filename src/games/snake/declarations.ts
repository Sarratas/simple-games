export type Pos2D = {
    x: number,
    y: number,
}

export const SEGMENT_SIZE = 20;
export const FRAMES_PER_SECOND = 15;
export const MAX_FOOD_COUNT = 20;
export const FOOD_SPAWN_TIMER = 1 * FRAMES_PER_SECOND;

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';