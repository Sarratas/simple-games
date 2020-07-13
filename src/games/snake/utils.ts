export function randomIntWithDivisor(min: number, max: number, divisor: number): number {
    const number = randomInt(min, max);
    return Math.floor(number / divisor) * divisor;
}

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

