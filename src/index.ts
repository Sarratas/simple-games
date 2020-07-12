import { Manager } from './manager.js';

const canvasWrapper = document.getElementById('canvas-wrapper') as HTMLDivElement;
const buttonsWrapper = document.getElementById('buttons-wrapper') as HTMLDivElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const backButton = document.getElementById('back-button') as HTMLButtonElement;

new Manager(canvas, canvasWrapper, buttonsWrapper, backButton);
